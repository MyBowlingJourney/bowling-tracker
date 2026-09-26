-- BASELINE. Generated once from the live database; not edited by hand.
-- Later changes go in new migration files beside this one.

CREATE OR REPLACE FUNCTION public.accept_team_invite(invite_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
                declare
                  inv record;
                    caller_email text := lower(auth.jwt() ->> 'email');
                    begin
                      select * into inv from public.pending_invites where id = invite_id;
                        if inv is null then return false; end if;

                          -- The row must actually be addressed to the caller. Without this check
                            -- the security definer above would let any signed-in user accept any
                              -- invite by id and add themselves to a stranger's team.
                                if lower(inv.invited_email) <> caller_email then return false; end if;
                                  if inv.accepted_at is not null or inv.declined_at is not null then return false; end if;

                                    -- Guarded rather than "on conflict (team_id, user_id)".
                                      --
                                        -- team_members has no create-table in this repo, so that constraint is
                                          -- assumed rather than known -- and an ON CONFLICT naming columns with
                                            -- no matching unique index fails outright with 42P10. The existing
                                              -- handle_new_user() makes the same assumption, but it has been running
                                                -- in production long enough to have proved it; this function has not
                                                  -- run at all yet, so it should not stake a new feature on it.
                                                    --
                                                      -- An explicit existence check needs no constraint and behaves the same.
                                                        if not exists (
                                                            select 1 from public.team_members
                                                                where team_id = inv.team_id and user_id = auth.uid()
                                                                  ) then
                                                                      insert into public.team_members (team_id, user_id, lineup_position)
                                                                          values (inv.team_id, auth.uid(), inv.lineup_position);
                                                                            end if;

                                                                              update public.pending_invites
                                                                                set accepted_at = now(), accepted_user_id = auth.uid()
                                                                                  where id = inv.id;

                                                                                    return true;
                                                                                    end;
                                                                                    $function$
;

CREATE OR REPLACE FUNCTION public.add_my_league(p_league_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  insert into public.user_leagues (user_id, league_id)
  select auth.uid(), l.id from public.leagues l
  where l.id = p_league_id and auth.uid() is not null
  on conflict do nothing;
$function$
;

CREATE OR REPLACE FUNCTION public.answer_team_request(p_request_id uuid, p_accept boolean)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  r record;
  on_team boolean;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  select * into r from public.team_join_requests where id = p_request_id for update;
  if not found or r.status <> 'pending' then
    raise exception 'that request is no longer open' using errcode = 'P0002';
  end if;

  on_team := public.is_team_member(r.team_id)
    or exists (select 1 from public.teams where id = r.team_id and created_by = me);

  if r.kind = 'request' then
    if p_accept and not on_team then
      raise exception 'only the team can approve this' using errcode = '42501';
    end if;
    if not p_accept and not (on_team or me = r.user_id) then
      raise exception 'not yours to answer' using errcode = '42501';
    end if;
  else
    if p_accept and me <> r.user_id then
      raise exception 'only the invited bowler can accept' using errcode = '42501';
    end if;
    if not p_accept and not (on_team or me = r.user_id) then
      raise exception 'not yours to answer' using errcode = '42501';
    end if;
  end if;

  if p_accept then
    insert into public.team_members (team_id, user_id, lineup_position)
    values (r.team_id, r.user_id, public.next_lineup_position(r.team_id))
    on conflict do nothing;
  end if;

  update public.team_join_requests
     set status = case
                    when p_accept then 'accepted'
                    when me = r.user_id and r.kind = 'request' then 'canceled'
                    when me <> r.user_id and r.kind = 'invite' then 'canceled'
                    else 'declined'
                  end,
         decided_by = me,
         decided_at = now()
   where id = r.id;
  return p_accept;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.are_friends(other_user uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.friendships
    where status = 'accepted'
      and (
        (requester_id = auth.uid() and addressee_id = other_user) or
        (addressee_id = auth.uid() and requester_id = other_user)
      )
  );
$function$
;

CREATE OR REPLACE FUNCTION public.befriend_teammates()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  n integer := 0;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  insert into public.friendships (id, requester_id, addressee_id, status)
  select gen_random_uuid(), me, mate.user_id, 'accepted'
  from (
    select distinct tm2.user_id
    from public.team_members tm1
    join public.team_members tm2 on tm2.team_id = tm1.team_id
    where tm1.user_id = me and tm2.user_id <> me
  ) mate
  where not exists (
    select 1 from public.friendships f
    where (f.requester_id = me and f.addressee_id = mate.user_id)
       or (f.requester_id = mate.user_id and f.addressee_id = me)
  );
  get diagnostics n = row_count;
  declare m integer; begin
  -- A pending request between teammates becomes a friendship too.
  update public.friendships f
     set status = 'accepted'
   where f.status = 'pending'
     and ((f.requester_id = me and f.addressee_id in (
            select tm2.user_id from public.team_members tm1
            join public.team_members tm2 on tm2.team_id = tm1.team_id
            where tm1.user_id = me))
       or (f.addressee_id = me and f.requester_id in (
            select tm2.user_id from public.team_members tm1
            join public.team_members tm2 on tm2.team_id = tm1.team_id
            where tm1.user_id = me)));
  get diagnostics m = row_count;
  -- Counted too, so the app knows to re-read its friends list.
  return n + m;
  end;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.bowler_for_name(p_owner uuid, p_name text)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select id from (
    select id, 0 as rank from public.bowler_names
     where created_by = p_owner and lower(name) = lower(btrim(p_name))
    union all
    select id, 1 from public.bowler_names
     where created_by = p_owner
       and exists (select 1 from unnest(aliases) a where lower(a) = lower(btrim(p_name)))
  ) m
  order by rank
  limit 1
$function$
;

CREATE OR REPLACE FUNCTION public.check_api_rate_limit(p_endpoint text, p_limit integer, p_window interval)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  recent integer;
begin
  if auth.uid() is null then return false; end if;

  select count(*) into recent
  from public.api_usage
  where user_id = auth.uid()
    and endpoint = p_endpoint
    and called_at > now() - p_window;

  if recent >= p_limit then return false; end if;

  insert into public.api_usage (user_id, endpoint) values (auth.uid(), p_endpoint);
  return true;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.claim_coaching_code(code text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  inv record;
  me uuid := auth.uid();
  new_coach uuid;
  new_bowler uuid;
  rel_id uuid;
begin
  if me is null then
    raise exception 'You must be signed in';
  end if;
  if code is null or length(trim(code)) = 0 then
    raise exception 'A code is required';
  end if;

  select * into inv
  from coaching_invites
  where upper(coaching_invites.code) = upper(trim(claim_coaching_code.code))
    and accepted_at is null
    and code_expires_at > now()
  limit 1;

  if not found then
    -- One message for "wrong", "used" and "expired", as claim_signup_code
    -- does: telling a stranger which it is helps them guess at real codes.
    raise exception 'That code is not valid';
  end if;

  if inv.created_by = me then
    -- Worth its own message. This one is not an attack, it is somebody
    -- testing their own code, and "not valid" would send them looking
    -- for a bug that isn't there.
    raise exception 'That is your own code — send it to the other person';
  end if;

  if inv.inviter_is_coach then
    new_coach := inv.created_by;
    new_bowler := me;
  else
    new_coach := me;
    new_bowler := inv.created_by;
  end if;

  -- Already connected, either way round. The unique constraint covers
  -- one direction; this also catches the pair having swapped roles,
  -- which would otherwise create a second, contradictory relationship.
  select id into rel_id
  from coaching_relationships
  where (coach_id = new_coach and bowler_id = new_bowler)
     or (coach_id = new_bowler and bowler_id = new_coach)
  limit 1;

  if rel_id is not null then
    -- Burn the code anyway: it has done its job, and leaving it live
    -- means a code that "does nothing" when retried.
    update coaching_invites
      set accepted_at = now(), accepted_user_id = me, code = null
      where id = inv.id;
    return rel_id;
  end if;

  -- Straight to accepted, with no request to answer.
  --
  -- The two-step pending/accept dance existed because a name search
  -- could pick the wrong person, so the other side had to confirm they
  -- were who the searcher meant. A code carries that confirmation
  -- already: one person generated it and the other typed it in, which
  -- is both sides acting deliberately.
  insert into coaching_relationships (coach_id, bowler_id, requested_by, status)
  values (new_coach, new_bowler, inv.created_by, 'accepted')
  returning id into rel_id;

  update coaching_invites
    set accepted_at = now(), accepted_user_id = me, code = null
    where id = inv.id;

  return rel_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.claim_signup_code(code text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  inv record;
begin
  if code is null or length(trim(code)) = 0 then
    raise exception 'A code is required';
  end if;

  select * into inv
  from pending_invites
  where upper(signup_code) = upper(trim(code))
    and accepted_at is null
    and (code_expires_at is null or code_expires_at > now())
  limit 1;

  if not found then
    -- Deliberately one message for "wrong", "used" and "expired": telling
    -- a stranger which of those it is helps them guess at real codes.
    raise exception 'That code is not valid';
  end if;

  insert into team_members (team_id, user_id, lineup_position)
  values (inv.team_id, auth.uid(), coalesce(inv.lineup_position, 0))
  on conflict do nothing;

  update pending_invites
  set accepted_at = now(),
      accepted_user_id = auth.uid(),
      signup_code = null
  where id = inv.id;

  return inv.team_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_orphaned_groups()
 RETURNS TABLE(deleted_teams integer, deleted_leagues integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  t_count integer := 0;
  l_count integer := 0;
BEGIN
  -- Teams first. A team is dead only when it has no creator left AND
  -- nothing whatsoever references it -- because deleting a team CASCADES
  -- to matches, lane_patterns, pending_invites and team_members. Get this
  -- condition wrong and you destroy other bowlers' match records, which is
  -- far worse than leaving an empty team lying about.
  WITH gone AS (
    DELETE FROM public.teams t
     WHERE t.created_by IS NULL
       AND NOT EXISTS (SELECT 1 FROM public.team_members    x WHERE x.team_id = t.id)
       AND NOT EXISTS (SELECT 1 FROM public.sessions        x WHERE x.team_id = t.id)
       AND NOT EXISTS (SELECT 1 FROM public.shots           x WHERE x.team_id = t.id)
       AND NOT EXISTS (SELECT 1 FROM public.matches         x WHERE x.team_id = t.id)
       AND NOT EXISTS (SELECT 1 FROM public.lane_patterns   x WHERE x.team_id = t.id)
       AND NOT EXISTS (SELECT 1 FROM public.pending_invites x WHERE x.team_id = t.id)
    RETURNING 1
  )
  SELECT count(*) INTO t_count FROM gone;

  -- Leagues second, so a league whose last team just went is now visible
  -- as empty. Deleting a league cascades to teams and manual_scores, so
  -- the same care applies.
  --
  -- hidden_leagues is deliberately NOT checked: it only records that
  -- someone hid the league, which is the opposite of using it.
  WITH gone AS (
    DELETE FROM public.leagues l
     WHERE l.created_by IS NULL
       AND NOT EXISTS (SELECT 1 FROM public.teams         x WHERE x.league_id = l.id)
       AND NOT EXISTS (SELECT 1 FROM public.sessions      x WHERE x.league_id = l.id)
       AND NOT EXISTS (SELECT 1 FROM public.shots         x WHERE x.league_id = l.id)
       AND NOT EXISTS (SELECT 1 FROM public.matches       x WHERE x.league_id = l.id)
       AND NOT EXISTS (SELECT 1 FROM public.lane_patterns x WHERE x.league_id = l.id)
       AND NOT EXISTS (SELECT 1 FROM public.manual_scores x WHERE x.league_id = l.id)
    RETURNING 1
  )
  SELECT count(*) INTO l_count FROM gone;

  RETURN QUERY SELECT t_count, l_count;
END $function$
;

CREATE OR REPLACE FUNCTION public.coached_bowler_handedness()
 RETURNS TABLE(bowler_user_id uuid, bowler_name text, left_handed boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select bp.created_by, bp.bowler_name, bp.left_handed
    from public.bowler_profiles bp
      where exists (
          select 1 from public.coaching_relationships r
              where r.bowler_id = bp.created_by
                    and r.coach_id = auth.uid()
                          and r.status = 'accepted'
                            );
                            $function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
                                                                                    declare
                                                                                      first_invite_name text;
                                                                                      begin
                                                                                        select invited_name into first_invite_name
                                                                                          from public.pending_invites
                                                                                            where lower(invited_email) = lower(new.email)
                                                                                                and accepted_at is null and declined_at is null
                                                                                                  order by created_at asc
                                                                                                    limit 1;

                                                                                                      insert into public.profiles (id, display_name)
                                                                                                        values (
                                                                                                            new.id,
                                                                                                                coalesce(first_invite_name, split_part(new.email, '@', 1))
                                                                                                                  );

                                                                                                                    -- Deliberately NOT joining teams here any more; the invite waits in
                                                                                                                      -- their inbox instead.
                                                                                                                        return new;
                                                                                                                        end;
                                                                                                                        $function$
;

CREATE OR REPLACE FUNCTION public.imported_scores_guard()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if current_user = 'authenticated' then
    if new.bowler_user_id is distinct from old.bowler_user_id
       or new.uploaded_by is distinct from old.uploaded_by
       or new.team_id is distinct from old.team_id
       or new.date is distinct from old.date then
      raise exception 'whose scores these are cannot be changed' using errcode = '42501';
    end if;
    if new.status is distinct from old.status
       and new.status in ('verified', 'rejected')
       and auth.uid() is distinct from old.bowler_user_id then
      raise exception 'only the bowler can confirm or reject their scores' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.invite_to_team(p_team_id uuid, p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  rid uuid;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if not (public.is_team_member(p_team_id)
          or exists (select 1 from public.teams where id = p_team_id and created_by = me)) then
    raise exception 'not on this team' using errcode = '42501';
  end if;
  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'no such bowler' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.team_members where team_id = p_team_id and user_id = p_user_id) then
    raise exception 'already on this team' using errcode = 'P0001', hint = 'already_member';
  end if;

  -- They already asked: inviting them is the team saying yes.
  select id into rid from public.team_join_requests
   where team_id = p_team_id and user_id = p_user_id and status = 'pending' and kind = 'request';
  if found then
    perform public.answer_team_request(rid, true);
    return rid;
  end if;

  select id into rid from public.team_join_requests
   where team_id = p_team_id and user_id = p_user_id and status = 'pending';
  if found then return rid; end if;

  insert into public.team_join_requests (team_id, user_id, kind, created_by)
  values (p_team_id, p_user_id, 'invite', me)
  returning id into rid;
  return rid;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_accepted_coach_of(target_bowler_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
      select 1 from public.coaching_relationships
          where bowler_id = target_bowler_id
                and coach_id = auth.uid()
                      and status = 'accepted'
                        );
                        $function$
;

CREATE OR REPLACE FUNCTION public.is_league_member(check_league_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1 FROM teams
            JOIN team_members ON team_members.team_id = teams.id
                WHERE teams.league_id = check_league_id
                    AND team_members.user_id = auth.uid()
                      );
                      $function$
;

CREATE OR REPLACE FUNCTION public.is_subscriber()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select auth.uid() is not null and (
    -- The reverse trial: the first 60 days of every account.
    exists (
      select 1 from auth.users u
       where u.id = auth.uid()
         and u.created_at > now() - interval '60 days'
    )
    or exists (
      select 1
        from public.entitlements e
       where e.user_id = auth.uid()
         and (
           e.is_test_account
           or (
             e.plan = 'plus'
             and (
               (e.status in ('trialing','active')
                 and (e.current_period_end is null or e.current_period_end > now()))
               or e.status = 'grace'
               or (e.status = 'canceled' and e.current_period_end > now())
             )
           )
         )
    )
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_team_member(check_team_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.team_members
    where team_id = check_team_id and user_id = auth.uid()
  );
$function$
;

CREATE OR REPLACE FUNCTION public.join_team_with_code(p_code text, p_confirm boolean DEFAULT false)
 RETURNS TABLE(team_id uuid, team_name text, league_id uuid, league_name text, switched_from text, needs_confirm boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  cleaned text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  formatted text;
  t record;
  inv record;
  via_invite boolean := false;
  current_team text;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if not public.check_api_rate_limit('join_team_with_code', 20, interval '1 hour') then
    raise exception 'Too many tries. Wait a little and try again.' using errcode = 'P0001';
  end if;
  -- A wrong code returns NO ROWS rather than raising: raising would roll
  -- back the attempt check_api_rate_limit just recorded.
  if length(cleaned) <> 8 then
    return;
  end if;
  formatted := substr(cleaned, 1, 4) || '-' || substr(cleaned, 5, 4);

  select tm.id, tm.name, tm.league_id into t
  from public.teams tm where tm.join_code = formatted;
  if not found then
    select * into inv
    from public.pending_invites pi
    where upper(pi.signup_code) = formatted
      and pi.accepted_at is null
      and (pi.code_expires_at is null or pi.code_expires_at > now())
    limit 1;
    if not found then
      return;
    end if;
    via_invite := true;
    select tm.id, tm.name, tm.league_id into t
    from public.teams tm where tm.id = inv.team_id;
  end if;

  current_team := public.my_team_in_league(me, t.league_id, t.id);
  if current_team is not null and not coalesce(p_confirm, false) then
    -- Ask first. Nothing has changed yet.
    return query select t.id, t.name, t.league_id,
      (select l.name from public.leagues l where l.id = t.league_id), current_team, true;
    return;
  end if;

  if via_invite then
    insert into public.team_members (team_id, user_id, lineup_position)
    values (inv.team_id, me, coalesce(inv.lineup_position, public.next_lineup_position(inv.team_id)))
    on conflict do nothing;
    update public.pending_invites
       set accepted_at = now(), accepted_user_id = me, signup_code = null
     where id = inv.id;
  else
    insert into public.team_members (team_id, user_id, lineup_position)
    values (t.id, me, public.next_lineup_position(t.id))
    on conflict do nothing;
  end if;

  update public.team_join_requests r
     set status = 'accepted', decided_by = me, decided_at = now()
   where r.team_id = t.id and r.user_id = me and r.status = 'pending';

  return query select t.id, t.name, t.league_id,
    (select l.name from public.leagues l where l.id = t.league_id), current_team, false;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.league_matches(p_name text)
 RETURNS TABLE(id uuid, name text, center_id uuid, center_name text, center_city text, center_state text, bowlers integer, mine boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select l.id, l.name, l.center_id, c.name, c.city, c.state,
         (select count(*)::int from public.user_leagues ul where ul.league_id = l.id),
         exists (select 1 from public.user_leagues ul
                  where ul.league_id = l.id and ul.user_id = auth.uid())
    from public.leagues l
    left join public.bowling_centers c on c.id = l.center_id
   where auth.uid() is not null
     and lower(btrim(l.name)) = lower(btrim(coalesce(p_name, '')))
     and position('·' in l.name) = 0
   order by 7 desc, c.name nulls last
   limit 20;
$function$
;

CREATE OR REPLACE FUNCTION public.league_teams(p_league_id uuid)
 RETURNS TABLE(id uuid, name text, bowlers integer, is_member boolean, requested boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select t.id, t.name,
         (select count(*)::int from public.team_members m where m.team_id = t.id),
         exists (select 1 from public.team_members m where m.team_id = t.id and m.user_id = auth.uid()),
         exists (select 1 from public.team_join_requests r
                  where r.team_id = t.id and r.user_id = auth.uid() and r.status = 'pending')
    from public.teams t
   where t.league_id = p_league_id
     and exists (select 1 from public.user_leagues ul
                  where ul.user_id = auth.uid() and ul.league_id = p_league_id)
   order by t.name;
$function$
;

CREATE OR REPLACE FUNCTION public.leagues_owner_guard()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if current_user = 'authenticated' and new.created_by is distinct from old.created_by then
    raise exception 'a league''s creator cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.leagues_rename_guard()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.name is distinct from old.name
     and auth.uid() is not null
     and old.created_by is distinct from auth.uid() then
    raise exception 'only the bowler who added this league can rename it'
      using errcode = '42501';
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.link_row_to_bowler()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_owner uuid;
  v_id uuid;
  v_name text;
begin
  -- An update that touches neither the name nor the link: nothing to do.
  if tg_op = 'UPDATE'
     and new.bowler_name is not distinct from old.bowler_name
     and new.bowler_id is not distinct from old.bowler_id
     and new.bowler_id is not null then
    return new;
  end if;

  v_owner := nullif(to_jsonb(new) ->> tg_argv[0], '')::uuid;
  if v_owner is null or new.bowler_name is null or btrim(new.bowler_name) = '' then
    return new;
  end if;
  -- Only a real account gets bowlers (the FK would refuse anything else).
  if not exists (select 1 from auth.users where id = v_owner) then
    return new;
  end if;

  v_id := public.bowler_for_name(v_owner, new.bowler_name);
  if v_id is null then
    insert into public.bowler_names (id, name, created_by)
    values (gen_random_uuid(), btrim(new.bowler_name), v_owner)
    on conflict do nothing;
    v_id := public.bowler_for_name(v_owner, new.bowler_name);
  end if;

  select name into v_name from public.bowler_names where id = v_id;
  new.bowler_id := v_id;
  if v_name is not null then
    new.bowler_name := v_name;
  end if;
  return new;
end
$function$
;

CREATE OR REPLACE FUNCTION public.merge_bowlers(p_from_name text, p_into_name text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := auth.uid();
  f public.bowler_names;
  i public.bowler_names;
  n record;
  v_off int;
begin
  if v_me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  select * into f from public.bowler_names where created_by = v_me and lower(name) = lower(btrim(p_from_name));
  select * into i from public.bowler_names where created_by = v_me and lower(name) = lower(btrim(p_into_name));
  if f.id is null or i.id is null then raise exception 'no such bowler' using errcode = 'P0002'; end if;
  if f.id = i.id then return jsonb_build_object('merged', false); end if;

  -- Nights both bowled: the merged bowler's sessions are numbered after
  -- the ones already there, so neither night overwrites the other.
  for n in
    select distinct x.league_id, x.date from (
      select league_id, date from public.sessions      where bowler_id = f.id
      union select league_id, date from public.shots   where bowler_id = f.id
      union select league_id, date from public.manual_scores where bowler_id = f.id
      union select null::uuid, date from public.drills where bowler_id = f.id
    ) x
  loop
    select coalesce(max(seq), 0) into v_off from (
      select session_seq as seq from public.sessions where bowler_id = i.id and league_id is not distinct from n.league_id and date = n.date
      union all select session_seq from public.shots where bowler_id = i.id and league_id is not distinct from n.league_id and date = n.date
      union all select session_seq from public.manual_scores where bowler_id = i.id and league_id is not distinct from n.league_id and date = n.date
      union all select session_seq from public.drills where bowler_id = i.id and n.league_id is null and date = n.date
    ) s;
    if v_off > 0 then
      -- In two steps (up out of the way, then down into place): moving
      -- 1 -> 2 in one go collides with the row still sitting at 2.
      update public.sessions      set session_seq = session_seq + 100000 where bowler_id = f.id and league_id is not distinct from n.league_id and date = n.date;
      update public.sessions      set session_seq = session_seq - 100000 + v_off where bowler_id = f.id and league_id is not distinct from n.league_id and date = n.date;
      update public.shots         set session_seq = session_seq + 100000 where bowler_id = f.id and league_id is not distinct from n.league_id and date = n.date;
      update public.shots         set session_seq = session_seq - 100000 + v_off where bowler_id = f.id and league_id is not distinct from n.league_id and date = n.date;
      update public.manual_scores set session_seq = session_seq + 100000 where bowler_id = f.id and league_id is not distinct from n.league_id and date = n.date;
      update public.manual_scores set session_seq = session_seq - 100000 + v_off where bowler_id = f.id and league_id is not distinct from n.league_id and date = n.date;
      if n.league_id is null then
        update public.drills set session_seq = session_seq + v_off where bowler_id = f.id and date = n.date;
      end if;
    end if;
  end loop;

  -- One profile and one set of goals per bowler: the one being kept wins.
  delete from public.bowler_profiles where bowler_id = f.id
     and exists (select 1 from public.bowler_profiles where bowler_id = i.id);
  delete from public.bowler_goals where bowler_id = f.id
     and exists (select 1 from public.bowler_goals where bowler_id = i.id);

  -- Same-named bags and groups become one; their balls move across.
  update public.ball_bags bb set bag_id = ib.id
    from public.bags fb, public.bags ib
   where bb.bag_id = fb.id and fb.bowler_id = f.id
     and ib.bowler_id = i.id and lower(ib.name) = lower(fb.name)
     and not exists (select 1 from public.ball_bags x where x.bag_id = ib.id and lower(x.ball) = lower(bb.ball));
  delete from public.bags fb using public.bags ib
   where fb.bowler_id = f.id and ib.bowler_id = i.id and lower(ib.name) = lower(fb.name);
  update public.arsenals a set group_id = ig.id
    from public.ball_groups fg, public.ball_groups ig
   where a.group_id = fg.id and fg.bowler_id = f.id
     and ig.bowler_id = i.id and lower(ig.name) = lower(fg.name);
  delete from public.ball_groups fg using public.ball_groups ig
   where fg.bowler_id = f.id and ig.bowler_id = i.id and lower(ig.name) = lower(fg.name);
  -- A ball both had stays once, with the kept bowler's specs.
  delete from public.arsenals fa using public.arsenals ia
   where fa.bowler_id = f.id and ia.bowler_id = i.id and lower(ia.ball) = lower(fa.ball);
  delete from public.ball_bags fb using public.ball_bags ib
   where fb.bowler_id = f.id and ib.bowler_id = i.id
     and ib.bag_id = fb.bag_id and lower(ib.ball) = lower(fb.ball);

  -- Everything else moves.
  update public.bowler_names
     set aliases = array(select distinct a from unnest(i.aliases || f.aliases || f.name) a
                          where lower(a) <> lower(i.name)),
         is_self = i.is_self or f.is_self
   where id = i.id;
  update public.shots           set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.sessions        set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.manual_scores   set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.drills          set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.tournaments     set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.arsenals        set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.bags            set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.ball_bags       set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.ball_groups     set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.bowler_goals    set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.bowler_profiles set bowler_id = i.id, bowler_name = i.name where bowler_id = f.id;
  update public.imported_scores set bowler_name = i.name
   where lower(bowler_name) = lower(f.name)
     and ((i.is_self and bowler_user_id = v_me) or (bowler_user_id is null and uploaded_by = v_me));

  delete from public.bowler_names where id = f.id;
  return jsonb_build_object('merged', true, 'from', f.name, 'into', i.name);
end
$function$
;

CREATE OR REPLACE FUNCTION public.merge_into_league(p_from uuid, p_to uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  f record;
  t record;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  select * into f from public.leagues where id = p_from for update;
  select * into t from public.leagues where id = p_to for update;
  if f.id is not null and t.id is not null
     and f.created_by is distinct from me and t.created_by = me then
    declare tmp record;
    begin
      tmp := f; f := t; t := tmp;
      p_from := f.id; p_to := t.id;
    end;
  end if;
  if f.id is null or t.id is null or p_from = p_to then
    raise exception 'no such league' using errcode = 'P0002';
  end if;
  if f.created_by is distinct from me then
    raise exception 'only the bowler who made this league can combine it' using errcode = '42501';
  end if;
  if lower(btrim(f.name)) <> lower(btrim(t.name)) or position('·' in t.name) > 0 then
    raise exception 'leagues must have the same name' using errcode = '22023';
  end if;

  -- Nights logged in both copies: shift the copy's session numbers past
  -- the highest one the shared league already has for that bowler and day.
  create temp table merge_shift on commit drop as
  with from_keys as (
    select user_id, bowler_name, date from public.sessions where league_id = p_from
    union
    select user_id, bowler_name, date from public.shots where league_id = p_from
    union
    select user_id, bowler_name, date from public.manual_scores where league_id = p_from
  ),
  to_max as (
    select user_id, bowler_name, date, max(session_seq) as m from (
      select user_id, bowler_name, date, session_seq from public.sessions where league_id = p_to
      union all
      select user_id, bowler_name, date, session_seq from public.shots where league_id = p_to
      union all
      select user_id, bowler_name, date, session_seq from public.manual_scores where league_id = p_to
    ) x group by 1, 2, 3
  )
  ,
  from_max as (
    select user_id, bowler_name, date, max(session_seq) as m from (
      select user_id, bowler_name, date, session_seq from public.sessions where league_id = p_from
      union all
      select user_id, bowler_name, date, session_seq from public.shots where league_id = p_from
      union all
      select user_id, bowler_name, date, session_seq from public.manual_scores where league_id = p_from
    ) y group by 1, 2, 3
  )
  -- At least the copy's own highest number, so no row is moved onto a
  -- number another row of the copy still holds (the unique keys are
  -- checked row by row).
  select k.user_id, k.bowler_name, k.date, greatest(tm.m, coalesce(fm.m, 0)) as shift
  from from_keys k
  join to_max tm using (user_id, bowler_name, date)
  left join from_max fm using (user_id, bowler_name, date);

  update public.sessions s set session_seq = s.session_seq + ms.shift
    from merge_shift ms
   where s.league_id = p_from and s.user_id = ms.user_id and s.bowler_name = ms.bowler_name and s.date = ms.date;
  update public.shots s set session_seq = s.session_seq + ms.shift
    from merge_shift ms
   where s.league_id = p_from and s.user_id = ms.user_id and s.bowler_name = ms.bowler_name and s.date = ms.date;
  update public.manual_scores s set session_seq = s.session_seq + ms.shift
    from merge_shift ms
   where s.league_id = p_from and s.user_id = ms.user_id and s.bowler_name = ms.bowler_name and s.date = ms.date;

  insert into public.user_leagues (user_id, league_id)
  select user_id, p_to from public.user_leagues where league_id = p_from
  on conflict do nothing;

  update public.sessions        set league_id = p_to where league_id = p_from;
  update public.shots           set league_id = p_to, league_name = t.name where league_id = p_from;
  update public.manual_scores   set league_id = p_to where league_id = p_from;
  update public.matches         set league_id = p_to where league_id = p_from;
  update public.imported_scores set league_id = p_to where league_id = p_from;
  update public.lane_patterns   set league_id = p_to where league_id = p_from;
  update public.teams           set league_id = p_to where league_id = p_from;
  update public.entitlements    set kept_league_id = p_to where kept_league_id = p_from;
  delete from public.hidden_leagues where league_id = p_from;

  update public.leagues
     set center_id    = coalesce(center_id, f.center_id),
         start_date   = coalesce(start_date, f.start_date),
         end_date     = coalesce(end_date, f.end_date),
         format       = coalesce(format, f.format),
         pattern_name = coalesce(pattern_name, f.pattern_name)
   where id = p_to;

  delete from public.leagues where id = p_from;
  return p_to;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.my_pro_usage()
 RETURNS TABLE(endpoint text, calls bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select t.endpoint, count(*)::bigint
    from public.ai_token_usage t
   where t.user_id = auth.uid()
     and t.endpoint in ('nightcap', 'bowling-genie', 'analyze-performance', 'caddie', 'import-scorecard')
   group by t.endpoint
$function$
;

CREATE OR REPLACE FUNCTION public.my_team_in_league(p_user uuid, p_league uuid, p_except uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select t.name from public.team_members m
    join public.teams t on t.id = m.team_id
   where m.user_id = p_user and t.league_id = p_league
     and t.id is distinct from p_except
   order by m.joined_at
   limit 1;
$function$
;

CREATE OR REPLACE FUNCTION public.my_team_requests()
 RETURNS TABLE(id uuid, team_id uuid, team_name text, league_id uuid, league_name text, user_id uuid, bowler_name text, kind text, created_at timestamp with time zone, mine_to_answer boolean, current_team text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select r.id, r.team_id, t.name, t.league_id, l.name,
         r.user_id, coalesce(p.display_name, 'A bowler'), r.kind, r.created_at,
         case when r.kind = 'invite' then r.user_id = auth.uid()
              else public.is_team_member(r.team_id) or t.created_by = auth.uid() end,
         public.my_team_in_league(r.user_id, t.league_id, t.id)
    from public.team_join_requests r
    join public.teams t on t.id = r.team_id
    left join public.leagues l on l.id = t.league_id
    left join public.profiles p on p.id = r.user_id
   where r.status = 'pending'
     and (r.user_id = auth.uid()
          or public.is_team_member(r.team_id)
          or t.created_by = auth.uid())
   order by r.created_at;
$function$
;

CREATE OR REPLACE FUNCTION public.new_team_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  raw text;
  candidate text;
begin
  loop
    raw := '';
    for i in 1..8 loop
      raw := raw || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    candidate := substr(raw, 1, 4) || '-' || substr(raw, 5, 4);
    exit when not exists (select 1 from public.teams where join_code = candidate);
  end loop;
  return candidate;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.next_lineup_position(p_team_id uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(max(lineup_position) + 1, 0)
  from public.team_members where team_id = p_team_id;
$function$
;

CREATE OR REPLACE FUNCTION public.pending_invites_guard()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if current_user = 'authenticated' then
    if new.team_id is distinct from old.team_id
       or new.invited_email is distinct from old.invited_email
       or new.created_by is distinct from old.created_by
       or new.signup_code is distinct from old.signup_code then
      raise exception 'an invite cannot be moved to another team or person' using errcode = '42501';
    end if;
    -- Someone who is not on the team (the invitee) may only answer it.
    if not public.is_team_member(old.team_id)
       and (new.invited_name is distinct from old.invited_name
         or new.lineup_position is distinct from old.lineup_position
         or new.is_sub is distinct from old.is_sub
         or new.left_handed is distinct from old.left_handed
         or new.code_expires_at is distinct from old.code_expires_at) then
      raise exception 'only the team can change an invite' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.prune_ai_token_usage()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  removed integer;
begin
  delete from public.ai_token_usage
  where called_at < now() - interval '13 months';
  get diagnostics removed = row_count;
  return removed;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.prune_api_usage()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  delete from public.api_usage where called_at < now() - interval '1 day';
$function$
;

CREATE OR REPLACE FUNCTION public.prune_error_reports()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  delete from public.error_reports where last_seen < now() - interval '90 days';
$function$
;

CREATE OR REPLACE FUNCTION public.prune_sync_tombstones()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  removed integer;
begin
  delete from sync_tombstones where deleted_at < now() - interval '90 days';
  get diagnostics removed = row_count;
  return removed;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.record_ai_tokens(p_endpoint text, p_model text, p_variant text, p_prompt integer, p_output integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  clean_prompt integer;
  clean_output integer;
begin
  if auth.uid() is null then return; end if;

  -- Only record for a caller who actually passed a rate-limit check for
  -- this endpoint recently.
  --
  -- Without this the function is an open write endpoint: anyone signed in
  -- could post numbers that never corresponded to a Gemini call. The
  -- entire value of this table is being trustworthy enough to budget
  -- against, and a cost record anyone can edit is worth less than no cost
  -- record, because you'd act on it.
  --
  -- 15 minutes is generous on purpose -- a slow scorecard read against a
  -- big image should still get counted.
  if not exists (
    select 1 from public.api_usage
    where user_id = auth.uid()
      and endpoint = p_endpoint
      and called_at > now() - interval '15 minutes'
  ) then
    return;
  end if;

  -- Clamped, not trusted. A malformed or hostile value should not be able
  -- to make a month's report meaningless. 10M is far above any real
  -- single call and far below the range where a sum overflows.
  clean_prompt := least(greatest(coalesce(p_prompt, 0), 0), 10000000);
  clean_output := least(greatest(coalesce(p_output, 0), 0), 10000000);

  if clean_prompt = 0 and clean_output = 0 then return; end if;

  insert into public.ai_token_usage
    (user_id, endpoint, model, variant, prompt_tokens, output_tokens, total_tokens)
  values (
    auth.uid(),
    p_endpoint,
    coalesce(nullif(btrim(p_model), ''), 'unknown'),
    nullif(btrim(p_variant), ''),
    clean_prompt,
    clean_output,
    clean_prompt + clean_output
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.record_tombstone()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- When the whole account is being deleted, the sessions and shots go
  -- with it and there is no one left to sync the deletion to. Recording a
  -- tombstone then would point at a user that no longer exists and make
  -- the account deletion fail ("Database error deleting user").
  if not exists (select 1 from auth.users where id = old.user_id) then
    return old;
  end if;
  insert into sync_tombstones (table_name, row_id, user_id)
  values (TG_TABLE_NAME, old.id, old.user_id);
  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.relabel_bowler_rows(p_bowler uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_name text; t text;
begin
  select name into v_name from public.bowler_names where id = p_bowler;
  if v_name is null then return; end if;
  foreach t in array array['shots','sessions','manual_scores','drills','tournaments',
                           'arsenals','bags','ball_bags','ball_groups','bowler_goals','bowler_profiles']
  loop
    execute format('update public.%I set bowler_name = $1 where bowler_id = $2 and bowler_name is distinct from $1', t)
      using v_name, p_bowler;
  end loop;
end
$function$
;

CREATE OR REPLACE FUNCTION public.rename_bowler(p_old_name text, p_new_name text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := auth.uid();
  v_new text := btrim(coalesce(p_new_name, ''));
  b public.bowler_names;
begin
  if v_me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if v_new = '' or length(v_new) > 60 then raise exception 'invalid name' using errcode = '22023'; end if;

  select * into b from public.bowler_names
   where created_by = v_me and lower(name) = lower(btrim(p_old_name));
  if b.id is null then raise exception 'no such bowler' using errcode = 'P0002'; end if;

  if exists (select 1 from public.bowler_names
              where created_by = v_me and lower(name) = lower(v_new) and id <> b.id) then
    raise exception 'name_taken' using errcode = '23505';
  end if;

  if b.name = v_new then
    return jsonb_build_object('old_name', b.name, 'new_name', v_new, 'changed', false);
  end if;

  -- The new name stops being anybody else's old name.
  update public.bowler_names
     set aliases = array(select a from unnest(aliases) a where lower(a) <> lower(v_new))
   where created_by = v_me and id <> b.id
     and exists (select 1 from unnest(aliases) a where lower(a) = lower(v_new));

  update public.bowler_names
     set name = v_new,
         aliases = array(
           select distinct a from unnest(aliases || b.name) a
            where lower(a) <> lower(v_new))
   where id = b.id;

  perform public.relabel_bowler_rows(b.id);

  -- The profile's alias list is what the scorecard import matches names
  -- against; the old name belongs there too.
  update public.bowler_profiles
     set aliases = coalesce(aliases, '[]'::jsonb) || to_jsonb(b.name)
   where bowler_id = b.id
     and not (coalesce(aliases, '[]'::jsonb) ? b.name);

  -- Imported scorecard records waiting under the old name.
  update public.imported_scores
     set bowler_name = v_new
   where lower(bowler_name) = lower(b.name)
     and ((b.is_self and bowler_user_id = v_me)
          or (not b.is_self and bowler_user_id is null and uploaded_by = v_me));

  if b.is_self then
    update public.profiles set display_name = v_new where id = v_me;
  end if;

  return jsonb_build_object('old_name', b.name, 'new_name', v_new, 'changed', true);
end
$function$
;

CREATE OR REPLACE FUNCTION public.report_error(p_signature text, p_kind text, p_where text, p_code text, p_message text, p_count integer, p_build text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_user uuid := auth.uid();
  v_sig  text := left(coalesce(p_signature, ''), 200);
  v_add  integer := greatest(1, coalesce(p_count, 1));
  v_rows integer;
begin
  -- Anonymous callers and empty signatures get nothing, silently. This
  -- is called from a failure path; raising here would turn a logging
  -- problem into a second error.
  if v_user is null or v_sig = '' then
    return;
  end if;

  update public.error_reports
     set hits      = hits + v_add,
         last_seen = now(),
         message   = left(coalesce(p_message, ''), 300),
         build     = left(coalesce(p_build, ''), 80)
   where user_id = v_user
     and signature = v_sig;

  get diagnostics v_rows = row_count;
  if v_rows > 0 then
    return;
  end if;

  if (select count(*) from public.error_reports where user_id = v_user) >= 50 then
    return;
  end if;

  insert into public.error_reports
    (user_id, signature, kind, where_at, code, message, hits, build)
  values
    (v_user,
     v_sig,
     left(coalesce(p_kind, ''), 40),
     left(coalesce(p_where, ''), 120),
     left(coalesce(p_code, ''), 20),
     left(coalesce(p_message, ''), 300),
     v_add,
     left(coalesce(p_build, ''), 80))
  -- Two devices reporting the same signature at once: the loser of the
  -- race does nothing rather than failing, which would be logged as an
  -- error about failing to log an error.
  on conflict (user_id, signature) do nothing;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.request_to_join_team(p_team_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  lg uuid;
  rid uuid;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  select league_id into lg from public.teams where id = p_team_id;
  if lg is null then
    raise exception 'no such team' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.user_leagues where user_id = me and league_id = lg) then
    raise exception 'join the league first' using errcode = '42501';
  end if;
  if exists (select 1 from public.team_members where team_id = p_team_id and user_id = me) then
    raise exception 'already on this team' using errcode = 'P0001', hint = 'already_member';
  end if;

  select id into rid from public.team_join_requests
   where team_id = p_team_id and user_id = me and status = 'pending' and kind = 'invite';
  if found then
    perform public.answer_team_request(rid, true);
    return rid;
  end if;

  select id into rid from public.team_join_requests
   where team_id = p_team_id and user_id = me and status = 'pending';
  if found then return rid; end if;

  -- One open request per league: asking a second team withdraws the first.
  update public.team_join_requests r
     set status = 'canceled', decided_by = me, decided_at = now()
    from public.teams t
   where t.id = r.team_id and t.league_id = lg
     and r.user_id = me and r.kind = 'request' and r.status = 'pending';

  insert into public.team_join_requests (team_id, user_id, kind, created_by)
  values (p_team_id, me, 'request', me)
  returning id into rid;
  return rid;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.reset_team_code(p_team_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  fresh text;
begin
  if not (public.is_team_member(p_team_id)
          or exists (select 1 from public.teams where id = p_team_id and created_by = auth.uid())) then
    raise exception 'not on this team' using errcode = '42501';
  end if;
  fresh := public.new_team_code();
  update public.teams set join_code = fresh where id = p_team_id;
  return fresh;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_center_pins(p_center_id uuid, p_rack_type text, p_freefall_lanes integer[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  rt text := nullif(btrim(coalesce(p_rack_type, '')), '');
  lanes integer[];
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if rt is not null and rt not in ('string', 'freefall', 'mixed') then
    raise exception 'unknown pin type: %', rt using errcode = '22023';
  end if;
  -- Lane numbers only mean something for a mixed house; anywhere else a
  -- stale list would silently re-split the next time it became mixed.
  if rt = 'mixed' then
    select array_agg(distinct l order by l) into lanes
    from unnest(coalesce(p_freefall_lanes, '{}'::integer[])) l
    where l between 1 and 200;
  end if;

  update public.bowling_centers
     set rack_type = rt,
         freefall_lanes = lanes
   where id = p_center_id;
  if not found then
    raise exception 'no such center' using errcode = 'P0002';
  end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_display_name(p_name text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := auth.uid();
  v_new text := btrim(coalesce(p_name, ''));
  v_current text;
  s public.bowler_names;
  o public.bowler_names;
  v_merged boolean := false;
begin
  if v_me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if v_new = '' or length(v_new) > 60 then raise exception 'invalid name' using errcode = '22023'; end if;

  select display_name into v_current from public.profiles where id = v_me;
  select * into s from public.bowler_names where created_by = v_me and is_self;
  if s.id is null and v_current is not null then
    select * into s from public.bowler_names where created_by = v_me and lower(name) = lower(btrim(v_current));
    if s.id is not null then
      update public.bowler_names set is_self = true where id = s.id;
      s.is_self := true;
    end if;
  end if;

  if s.id is null then
    -- No bowler for you yet (a new account): use one already called
    -- this, or make it.
    select * into o from public.bowler_names where created_by = v_me and lower(name) = lower(v_new);
    if o.id is not null then
      update public.bowler_names set is_self = true where id = o.id;
    else
      insert into public.bowler_names (id, name, created_by, is_self)
      values (gen_random_uuid(), v_new, v_me, true);
    end if;
    insert into public.profiles (id, display_name) values (v_me, v_new)
      on conflict (id) do update set display_name = excluded.display_name;
    return jsonb_build_object('old_name', null, 'new_name', v_new, 'changed', false, 'merged', false);
  end if;

  select * into o from public.bowler_names
   where created_by = v_me and lower(name) = lower(v_new) and id <> s.id;
  if o.id is not null then
    perform public.merge_bowlers(o.name, s.name);
    v_merged := true;
  end if;

  if s.name <> v_new then
    perform public.rename_bowler(s.name, v_new);
  end if;
  update public.profiles set display_name = v_new where id = v_me;

  return jsonb_build_object('old_name', s.name, 'new_name', v_new,
                            'changed', s.name <> v_new, 'merged', v_merged);
end
$function$
;

CREATE OR REPLACE FUNCTION public.set_kept_league(p_league_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  me uuid := auth.uid();
  current_pick uuid;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if not exists (select 1 from public.user_leagues
                 where user_id = me and league_id = p_league_id) then
    raise exception 'not one of your leagues' using errcode = '22023';
  end if;

  insert into public.entitlements (user_id) values (me)
  on conflict (user_id) do nothing;

  select kept_league_id into current_pick
  from public.entitlements where user_id = me
  for update;

  if current_pick is not null and current_pick <> p_league_id then
    raise exception 'active league already chosen'
      using errcode = 'P0001', hint = 'kept_league_locked';
  end if;

  update public.entitlements
     set kept_league_id = p_league_id
   where user_id = me and kept_league_id is null;

  return p_league_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.team_members_guard()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if current_user = 'authenticated'
     and (new.team_id is distinct from old.team_id or new.user_id is distinct from old.user_id) then
    raise exception 'a roster row cannot be moved to another team or bowler' using errcode = '42501';
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.team_members_one_per_league()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  lg uuid;
begin
  select league_id into lg from public.teams where id = new.team_id;
  if lg is null then return new; end if;

  delete from public.team_members m
   using public.teams t
   where t.id = m.team_id
     and t.league_id = lg
     and m.user_id = new.user_id
     and m.team_id <> new.team_id;

  update public.team_join_requests r
     set status = 'canceled', decided_by = new.user_id, decided_at = now()
    from public.teams t
   where t.id = r.team_id
     and t.league_id = lg
     and r.user_id = new.user_id
     and r.team_id <> new.team_id
     and r.status = 'pending';
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.teammate_bowler_profiles()
 RETURNS TABLE(bowler_name text, left_handed boolean, backup_ball boolean, two_handed boolean, aliases jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select bp.bowler_name, bp.left_handed, bp.backup_ball, bp.two_handed, bp.aliases
  from public.bowler_profiles bp
  where exists (
    select 1
    from public.team_members me
    join public.team_members them on them.team_id = me.team_id
    where me.user_id = auth.uid()
      and them.user_id = bp.created_by
  )
  -- Own rows come from the table read, not here, so this returns only
  -- OTHER people's limited profiles.
  and bp.created_by <> auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.teams_member_guard()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if current_user = 'authenticated' then
    if new.created_by is distinct from old.created_by
       or new.league_id is distinct from old.league_id
       or new.id is distinct from old.id then
      raise exception 'only the team name can be changed here' using errcode = '42501';
    end if;
    if to_jsonb(new) ? 'join_code'
       and (to_jsonb(new) ->> 'join_code') is distinct from (to_jsonb(old) ->> 'join_code') then
      raise exception 'use Reset code to change the team code' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.user_leagues_from_row()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  who uuid;
  lg uuid;
begin
  if tg_table_name = 'leagues' then
    who := new.created_by; lg := new.id;
  elsif tg_table_name = 'team_members' then
    who := new.user_id;
    select t.league_id into lg from public.teams t where t.id = new.team_id;
  else
    who := new.user_id; lg := new.league_id;
  end if;
  if who is not null and lg is not null then
    insert into public.user_leagues (user_id, league_id)
    values (who, lg)
    on conflict do nothing;
  end if;
  return new;
end;
$function$
;


-- Generated from the live catalog. Do not edit by hand.
-- Rebuilds an EMPTY database: no data, no function bodies.

CREATE TABLE IF NOT EXISTS public.ai_token_usage (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid,
  endpoint text NOT NULL,
  model text NOT NULL,
  variant text,
  prompt_tokens integer DEFAULT 0 NOT NULL,
  output_tokens integer DEFAULT 0 NOT NULL,
  total_tokens integer DEFAULT 0 NOT NULL,
  called_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.api_usage (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  called_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.arsenals (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  bowler_name text,
  ball text,
  created_by uuid DEFAULT gen_random_uuid(),
  layout_system text,
  layout_values jsonb,
  group_id uuid,
  coverstock text,
  core_type text,
  weight numeric,
  rg numeric,
  diff numeric,
  int_diff numeric,
  retired_on date,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.bags (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  name text NOT NULL,
  bag_type text DEFAULT 'league'::text NOT NULL,
  ball_limit integer,
  includes_plastic boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.ball_bags (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  ball text NOT NULL,
  bag_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.ball_confirmations (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  submission_id uuid NOT NULL,
  confirmed_by uuid,
  vote text DEFAULT 'approve'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.ball_groups (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  name text NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.ball_submissions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  submitted_by uuid,
  ball_key text NOT NULL,
  ball_name text NOT NULL,
  brand text,
  coverstock text,
  core_type text,
  weight numeric,
  rg numeric,
  diff numeric,
  int_diff numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  official boolean DEFAULT false NOT NULL,
  source_note text,
  weight_specs jsonb
);
CREATE TABLE IF NOT EXISTS public.bowler_goals (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  goals jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.bowler_names (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid DEFAULT auth.uid(),
  name text,
  left_handed boolean DEFAULT false NOT NULL,
  aliases text[] DEFAULT '{}'::text[] NOT NULL,
  is_self boolean DEFAULT false NOT NULL
);
CREATE TABLE IF NOT EXISTS public.bowler_profiles (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  left_handed boolean DEFAULT false NOT NULL,
  two_handed boolean DEFAULT false NOT NULL,
  home_centers text[] DEFAULT '{}'::text[] NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  book_average numeric,
  book_games integer,
  book_season text,
  book_average_as_of date,
  is_coach boolean DEFAULT false NOT NULL,
  aliases jsonb,
  all_time_high_game integer,
  all_time_high_series integer,
  drift_boards text,
  lateral_offset text,
  backup_ball boolean DEFAULT false NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.bowling_centers (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  here_id text,
  name text NOT NULL,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  lat numeric,
  lng numeric,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  rack_type text,
  freefall_lanes integer[]
);
CREATE TABLE IF NOT EXISTS public.closed_seasons (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  league text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  closed_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.coaching_invites (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  code text,
  created_by uuid NOT NULL,
  inviter_is_coach boolean NOT NULL,
  code_expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval) NOT NULL,
  accepted_at timestamp with time zone,
  accepted_user_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.coaching_notes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  relationship_id uuid NOT NULL,
  author_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.coaching_relationships (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  coach_id uuid NOT NULL,
  bowler_id uuid NOT NULL,
  requested_by uuid NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  next_session date,
  next_session_note text
);
CREATE TABLE IF NOT EXISTS public.coaching_tasks (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  relationship_id uuid NOT NULL,
  assigned_by uuid NOT NULL,
  title text NOT NULL,
  detail text,
  metric_id text,
  target numeric,
  due_date date,
  status text DEFAULT 'open'::text NOT NULL,
  result numeric,
  bowler_note text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.drills (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid,
  bowler_name text NOT NULL,
  date date NOT NULL,
  target text NOT NULL,
  custom_target text,
  ball text,
  made integer DEFAULT 0 NOT NULL,
  missed integer DEFAULT 0 NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  custom_pins jsonb,
  session_seq integer DEFAULT 1 NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.entitlements (
  user_id uuid NOT NULL,
  plan text DEFAULT 'free'::text NOT NULL,
  source text,
  status text DEFAULT 'none'::text NOT NULL,
  current_period_end timestamp with time zone,
  trial_end timestamp with time zone,
  kept_league_id uuid,
  play_purchase_token text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  billing_period text,
  is_test_account boolean DEFAULT false NOT NULL,
  last_event_at timestamp with time zone
);
CREATE TABLE IF NOT EXISTS public.error_reports (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  signature text NOT NULL,
  kind text DEFAULT ''::text NOT NULL,
  where_at text DEFAULT ''::text NOT NULL,
  code text DEFAULT ''::text NOT NULL,
  message text DEFAULT ''::text NOT NULL,
  hits integer DEFAULT 1 NOT NULL,
  build text DEFAULT ''::text NOT NULL,
  first_seen timestamp with time zone DEFAULT now() NOT NULL,
  last_seen timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  responded_at timestamp with time zone
);
CREATE TABLE IF NOT EXISTS public.hidden_leagues (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid,
  league_id uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.imported_scores (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  bowler_user_id uuid,
  bowler_name text NOT NULL,
  uploaded_by uuid NOT NULL,
  team_id uuid,
  league_id uuid,
  date date NOT NULL,
  imported_scores jsonb DEFAULT '[]'::jsonb NOT NULL,
  corrected_scores jsonb,
  status text DEFAULT 'pending'::text NOT NULL,
  corrected_by uuid,
  responded_at timestamp with time zone,
  note text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  imported_shots jsonb,
  corrected_shots jsonb
);
CREATE TABLE IF NOT EXISTS public.lane_patterns (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  team_id uuid,
  league_id uuid,
  date date NOT NULL,
  lane text NOT NULL,
  pattern_type text DEFAULT 'house'::text NOT NULL,
  pattern_name text DEFAULT ''::text NOT NULL,
  length text DEFAULT ''::text NOT NULL,
  volume text DEFAULT ''::text NOT NULL,
  ratio text DEFAULT ''::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  notes text
);
CREATE TABLE IF NOT EXISTS public.leagues (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  center_id uuid,
  start_date date,
  end_date date,
  format text,
  pattern_name text
);
CREATE TABLE IF NOT EXISTS public.manual_scores (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid,
  bowler_name text NOT NULL,
  league_id uuid,
  date date NOT NULL,
  game integer NOT NULL,
  score integer,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  ball text,
  surface text,
  session_seq integer DEFAULT 1 NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  team_id uuid,
  league_id uuid,
  date date NOT NULL,
  games jsonb DEFAULT '[null, null, null]'::jsonb NOT NULL,
  series boolean,
  opponent text DEFAULT ''::text NOT NULL,
  handicap text DEFAULT ''::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.oil_patterns (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  series text,
  length_feet numeric,
  ratio text,
  volume_ml numeric,
  forward_ml numeric,
  reverse_ml numeric,
  verified boolean DEFAULT false NOT NULL,
  source_note text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  year integer
);
CREATE TABLE IF NOT EXISTS public.pending_invites (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  team_id uuid NOT NULL,
  invited_name text NOT NULL,
  invited_email text,
  lineup_position integer,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  accepted_at timestamp with time zone,
  accepted_user_id uuid,
  left_handed boolean DEFAULT false NOT NULL,
  is_sub boolean DEFAULT false NOT NULL,
  declined_at timestamp with time zone,
  signup_code text,
  code_expires_at timestamp with time zone
);
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  display_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  team_id uuid,
  league_id uuid,
  bowler_name text DEFAULT ''::text NOT NULL,
  date date NOT NULL,
  scores integer[] DEFAULT '{}'::integer[] NOT NULL,
  total integer,
  average integer,
  shot_count integer DEFAULT 0 NOT NULL,
  strikes integer DEFAULT 0 NOT NULL,
  weak_tens integer DEFAULT 0 NOT NULL,
  ringing_tens integer DEFAULT 0 NOT NULL,
  ten_pin_leaves integer DEFAULT 0 NOT NULL,
  single_pin_leaves integer DEFAULT 0 NOT NULL,
  single_pin_spares integer DEFAULT 0 NOT NULL,
  spare_attempts integer DEFAULT 0 NOT NULL,
  spares_made integer DEFAULT 0 NOT NULL,
  splits integer DEFAULT 0 NOT NULL,
  splits_converted integer DEFAULT 0 NOT NULL,
  balls_used jsonb DEFAULT '[]'::jsonb NOT NULL,
  misses jsonb DEFAULT '[]'::jsonb NOT NULL,
  releases jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  poker_quarter jsonb DEFAULT '[0, 0, 0]'::jsonb NOT NULL,
  poker_dollar jsonb DEFAULT '[0, 0, 0]'::jsonb NOT NULL,
  three_six_nine_winnings numeric DEFAULT 0 NOT NULL,
  jackpot_winnings numeric DEFAULT 0 NOT NULL,
  high_game_winnings numeric[] DEFAULT '{0,0,0}'::numeric[] NOT NULL,
  high_game_cost numeric[] DEFAULT '{0,0,0}'::numeric[] NOT NULL,
  poker_quarter_cost numeric[] DEFAULT '{0,0,0}'::numeric[] NOT NULL,
  poker_dollar_cost numeric[] DEFAULT '{0,0,0}'::numeric[] NOT NULL,
  three_six_nine_cost numeric DEFAULT 0 NOT NULL,
  prebowled_on date,
  notes text,
  session_seq integer DEFAULT 1 NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.shots (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  team_id uuid,
  league_id uuid,
  date date NOT NULL,
  game integer NOT NULL,
  frame integer NOT NULL,
  ball_num integer,
  lane text,
  ball text,
  surface text,
  starting_board text,
  target_arrows text,
  result text NOT NULL,
  other_leave jsonb DEFAULT '[]'::jsonb NOT NULL,
  spare_made text DEFAULT ''::text NOT NULL,
  strike_description text DEFAULT ''::text NOT NULL,
  release text DEFAULT ''::text NOT NULL,
  miss jsonb DEFAULT '[]'::jsonb NOT NULL,
  ball_change_reason jsonb DEFAULT '[]'::jsonb NOT NULL,
  pin_count text DEFAULT ''::text NOT NULL,
  notes text DEFAULT ''::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  bowler_name text DEFAULT ''::text NOT NULL,
  display_result text DEFAULT ''::text NOT NULL,
  display_leave jsonb DEFAULT '[]'::jsonb NOT NULL,
  ball_speed numeric,
  actual_arrows text,
  heel_number text,
  sole_number text,
  rev_rate numeric,
  axis_rotation numeric,
  imported_from uuid,
  no_tap boolean,
  league_name text,
  axis_tilt numeric,
  breakpoint_board text,
  breakpoint_distance text,
  second_leave jsonb,
  session_seq integer DEFAULT 1 NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  source text NOT NULL,
  event_id text NOT NULL,
  event_type text,
  event_time timestamp with time zone NOT NULL,
  user_id uuid,
  applied boolean DEFAULT false NOT NULL,
  received_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.sync_tombstones (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  table_name text NOT NULL,
  row_id uuid NOT NULL,
  user_id uuid NOT NULL,
  deleted_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.team_join_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  kind text NOT NULL,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  decided_by uuid,
  decided_at timestamp with time zone
);
CREATE TABLE IF NOT EXISTS public.team_members (
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  lineup_position integer,
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  left_handed boolean DEFAULT false NOT NULL,
  is_sub boolean DEFAULT false NOT NULL
);
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  league_id uuid NOT NULL,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  join_code text DEFAULT new_team_code() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.tournaments (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid,
  bowler_name text NOT NULL,
  name text NOT NULL,
  center text,
  days jsonb DEFAULT '[]'::jsonb NOT NULL,
  buy_in numeric,
  winnings numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  side_pots jsonb DEFAULT '[]'::jsonb NOT NULL,
  match_play jsonb DEFAULT '{}'::jsonb NOT NULL,
  placement text,
  placement_note text,
  format text,
  scoring_format text,
  handicap integer,
  baker_partner text,
  baker_starter text,
  scoring_basis text,
  tracking_mode text,
  pin_format text,
  play_style text,
  stepladder jsonb,
  match_play_next_round text,
  baker_alternate boolean DEFAULT true NOT NULL,
  bowler_id uuid
);
CREATE TABLE IF NOT EXISTS public.user_leagues (
  user_id uuid NOT NULL,
  league_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id uuid NOT NULL,
  preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.ai_token_usage ADD CONSTRAINT ai_token_usage_pkey PRIMARY KEY (id);
ALTER TABLE public.ai_token_usage ADD CONSTRAINT ai_token_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.api_usage ADD CONSTRAINT api_usage_pkey PRIMARY KEY (id);
ALTER TABLE public.api_usage ADD CONSTRAINT api_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.arsenals ADD CONSTRAINT arsenal_pkey PRIMARY KEY (id);
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_core_type_check CHECK (((core_type IS NULL) OR (core_type = ANY (ARRAY['symmetric'::text, 'asymmetric'::text]))));
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_coverstock_check CHECK (((coverstock IS NULL) OR (coverstock = ANY (ARRAY['solid'::text, 'pearl'::text, 'hybrid'::text, 'urethane'::text]))));
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_layout_system_check CHECK (((layout_system IS NULL) OR (layout_system = ANY (ARRAY['dual_angle'::text, 'vls'::text, '2ls'::text]))));
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_group_id_fkey FOREIGN KEY (group_id) REFERENCES ball_groups(id) ON DELETE SET NULL;
ALTER TABLE public.bags ADD CONSTRAINT bags_pkey PRIMARY KEY (id);
ALTER TABLE public.bags ADD CONSTRAINT bags_created_by_bowler_name_name_key UNIQUE (created_by, bowler_name, name);
ALTER TABLE public.bags ADD CONSTRAINT bags_bag_type_check CHECK ((bag_type = ANY (ARRAY['league'::text, 'tournament'::text])));
ALTER TABLE public.bags ADD CONSTRAINT bags_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.bags ADD CONSTRAINT bags_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_created_by_bowler_name_ball_bag_id_key UNIQUE (created_by, bowler_name, ball, bag_id);
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_bag_id_fkey FOREIGN KEY (bag_id) REFERENCES bags(id) ON DELETE CASCADE;
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_submission_id_confirmed_by_key UNIQUE (submission_id, confirmed_by);
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_vote_check CHECK ((vote = ANY (ARRAY['approve'::text, 'reject'::text])));
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES ball_submissions(id) ON DELETE CASCADE;
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_created_by_bowler_name_name_key UNIQUE (created_by, bowler_name, name);
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_submissions ADD CONSTRAINT ball_submissions_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_submissions ADD CONSTRAINT ball_submissions_submitted_by_ball_key_key UNIQUE (submitted_by, ball_key);
ALTER TABLE public.ball_submissions ADD CONSTRAINT ball_submissions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_pkey PRIMARY KEY (id);
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_created_by_bowler_name_key UNIQUE (created_by, bowler_name);
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowler_names ADD CONSTRAINT bowler_names_pkey PRIMARY KEY (id);
ALTER TABLE public.bowler_names ADD CONSTRAINT bowler_names_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_created_by_bowler_name_key UNIQUE (created_by, bowler_name);
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_owner_name_key UNIQUE (created_by, bowler_name);
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_all_time_high_game_check CHECK (((all_time_high_game IS NULL) OR ((all_time_high_game >= 0) AND (all_time_high_game <= 300))));
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_all_time_high_series_check CHECK (((all_time_high_series IS NULL) OR ((all_time_high_series >= 0) AND (all_time_high_series <= 900))));
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowling_centers ADD CONSTRAINT bowling_centers_pkey PRIMARY KEY (id);
ALTER TABLE public.bowling_centers ADD CONSTRAINT bowling_centers_here_id_key UNIQUE (here_id);
ALTER TABLE public.bowling_centers ADD CONSTRAINT bowling_centers_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.closed_seasons ADD CONSTRAINT closed_seasons_pkey PRIMARY KEY (id);
ALTER TABLE public.closed_seasons ADD CONSTRAINT closed_seasons_user_id_league_end_date_key UNIQUE (user_id, league, end_date);
ALTER TABLE public.closed_seasons ADD CONSTRAINT closed_seasons_check CHECK ((end_date >= start_date));
ALTER TABLE public.closed_seasons ADD CONSTRAINT closed_seasons_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_invites ADD CONSTRAINT coaching_invites_pkey PRIMARY KEY (id);
ALTER TABLE public.coaching_invites ADD CONSTRAINT coaching_invites_accepted_user_id_fkey FOREIGN KEY (accepted_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.coaching_invites ADD CONSTRAINT coaching_invites_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_notes ADD CONSTRAINT coaching_notes_pkey PRIMARY KEY (id);
ALTER TABLE public.coaching_notes ADD CONSTRAINT coaching_notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_notes ADD CONSTRAINT coaching_notes_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES coaching_relationships(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_pkey PRIMARY KEY (id);
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_coach_id_bowler_id_key UNIQUE (coach_id, bowler_id);
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_check CHECK ((coach_id <> bowler_id));
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text])));
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_relationships ADD CONSTRAINT coaching_relationships_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_tasks ADD CONSTRAINT coaching_tasks_pkey PRIMARY KEY (id);
ALTER TABLE public.coaching_tasks ADD CONSTRAINT coaching_tasks_status_check CHECK ((status = ANY (ARRAY['open'::text, 'completed'::text, 'attempted'::text])));
ALTER TABLE public.coaching_tasks ADD CONSTRAINT coaching_tasks_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coaching_tasks ADD CONSTRAINT coaching_tasks_relationship_id_fkey FOREIGN KEY (relationship_id) REFERENCES coaching_relationships(id) ON DELETE CASCADE;
ALTER TABLE public.drills ADD CONSTRAINT drills_pkey PRIMARY KEY (id);
ALTER TABLE public.drills ADD CONSTRAINT drills_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.drills ADD CONSTRAINT drills_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_pkey PRIMARY KEY (user_id);
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_billing_period_check CHECK ((billing_period = ANY (ARRAY['month'::text, 'year'::text])));
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_plan_check CHECK ((plan = ANY (ARRAY['free'::text, 'plus'::text])));
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_source_check CHECK ((source = ANY (ARRAY['play'::text, 'stripe'::text, 'manual'::text])));
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_status_check CHECK ((status = ANY (ARRAY['none'::text, 'trialing'::text, 'active'::text, 'grace'::text, 'on_hold'::text, 'paused'::text, 'canceled'::text, 'expired'::text])));
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_kept_league_id_fkey FOREIGN KEY (kept_league_id) REFERENCES leagues(id) ON DELETE SET NULL;
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_pkey PRIMARY KEY (id);
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_user_signature_key UNIQUE (user_id, signature);
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.friendships ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);
ALTER TABLE public.friendships ADD CONSTRAINT friendships_requester_id_addressee_id_key UNIQUE (requester_id, addressee_id);
ALTER TABLE public.friendships ADD CONSTRAINT friendships_check CHECK ((requester_id <> addressee_id));
ALTER TABLE public.friendships ADD CONSTRAINT friendships_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text])));
ALTER TABLE public.friendships ADD CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public.friendships ADD CONSTRAINT friendships_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public.hidden_leagues ADD CONSTRAINT hidden_leagues_pkey PRIMARY KEY (id);
ALTER TABLE public.hidden_leagues ADD CONSTRAINT hidden_leagues_user_id_league_id_key UNIQUE (user_id, league_id);
ALTER TABLE public.hidden_leagues ADD CONSTRAINT hidden_leagues_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE;
ALTER TABLE public.hidden_leagues ADD CONSTRAINT hidden_leagues_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.imported_scores ADD CONSTRAINT imported_scores_pkey PRIMARY KEY (id);
ALTER TABLE public.imported_scores ADD CONSTRAINT imported_scores_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'verified'::text, 'corrected'::text, 'rejected'::text, 'superseded'::text])));
ALTER TABLE public.imported_scores ADD CONSTRAINT imported_scores_bowler_user_id_fkey FOREIGN KEY (bowler_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.imported_scores ADD CONSTRAINT imported_scores_corrected_by_fkey FOREIGN KEY (corrected_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.imported_scores ADD CONSTRAINT imported_scores_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.lane_patterns ADD CONSTRAINT lane_patterns_pkey PRIMARY KEY (id);
ALTER TABLE public.lane_patterns ADD CONSTRAINT lane_patterns_team_id_date_lane_key UNIQUE (team_id, date, lane);
ALTER TABLE public.lane_patterns ADD CONSTRAINT lane_patterns_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL;
ALTER TABLE public.lane_patterns ADD CONSTRAINT lane_patterns_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE public.leagues ADD CONSTRAINT leagues_pkey PRIMARY KEY (id);
ALTER TABLE public.leagues ADD CONSTRAINT leagues_center_id_fkey FOREIGN KEY (center_id) REFERENCES bowling_centers(id) ON DELETE SET NULL;
ALTER TABLE public.leagues ADD CONSTRAINT leagues_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public.manual_scores ADD CONSTRAINT manual_scores_pkey PRIMARY KEY (id);
ALTER TABLE public.manual_scores ADD CONSTRAINT manual_scores_slot_key UNIQUE (user_id, bowler_name, league_id, date, game, session_seq);
ALTER TABLE public.manual_scores ADD CONSTRAINT manual_scores_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.manual_scores ADD CONSTRAINT manual_scores_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE;
ALTER TABLE public.manual_scores ADD CONSTRAINT manual_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.matches ADD CONSTRAINT matches_pkey PRIMARY KEY (id);
ALTER TABLE public.matches ADD CONSTRAINT matches_team_id_date_key UNIQUE (team_id, date);
ALTER TABLE public.matches ADD CONSTRAINT matches_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL;
ALTER TABLE public.matches ADD CONSTRAINT matches_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE public.oil_patterns ADD CONSTRAINT oil_patterns_pkey PRIMARY KEY (id);
ALTER TABLE public.oil_patterns ADD CONSTRAINT oil_patterns_name_key UNIQUE (name);
ALTER TABLE public.oil_patterns ADD CONSTRAINT oil_patterns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.pending_invites ADD CONSTRAINT pending_invites_pkey PRIMARY KEY (id);
ALTER TABLE public.pending_invites ADD CONSTRAINT pending_invites_team_id_invited_email_key UNIQUE (team_id, invited_email);
ALTER TABLE public.pending_invites ADD CONSTRAINT pending_invites_accepted_user_id_fkey FOREIGN KEY (accepted_user_id) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public.pending_invites ADD CONSTRAINT pending_invites_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public.pending_invites ADD CONSTRAINT pending_invites_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
ALTER TABLE public.sessions ADD CONSTRAINT sessions_user_id_bowler_name_league_id_date_seq_key UNIQUE (user_id, bowler_name, league_id, date, session_seq);
ALTER TABLE public.sessions ADD CONSTRAINT sessions_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public.shots ADD CONSTRAINT shots_pkey PRIMARY KEY (id);
ALTER TABLE public.shots ADD CONSTRAINT shots_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.shots ADD CONSTRAINT shots_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL;
ALTER TABLE public.shots ADD CONSTRAINT shots_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE public.shots ADD CONSTRAINT shots_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public.subscription_events ADD CONSTRAINT subscription_events_pkey PRIMARY KEY (id);
ALTER TABLE public.subscription_events ADD CONSTRAINT subscription_events_source_check CHECK ((source = ANY (ARRAY['play'::text, 'stripe'::text])));
ALTER TABLE public.subscription_events ADD CONSTRAINT subscription_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.sync_tombstones ADD CONSTRAINT sync_tombstones_pkey PRIMARY KEY (id);
ALTER TABLE public.sync_tombstones ADD CONSTRAINT sync_tombstones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_pkey PRIMARY KEY (id);
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_kind_check CHECK ((kind = ANY (ARRAY['request'::text, 'invite'::text])));
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'canceled'::text])));
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_decided_by_fkey FOREIGN KEY (decided_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE public.team_join_requests ADD CONSTRAINT team_join_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.team_members ADD CONSTRAINT team_members_pkey PRIMARY KEY (team_id, user_id);
ALTER TABLE public.team_members ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE public.team_members ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public.teams ADD CONSTRAINT teams_pkey PRIMARY KEY (id);
ALTER TABLE public.teams ADD CONSTRAINT teams_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public.teams ADD CONSTRAINT teams_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE;
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_match_play_next_round_check CHECK (((match_play_next_round IS NULL) OR (match_play_next_round = ANY (ARRAY['match'::text, 'stepladder'::text, 'na'::text]))));
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_placement_check CHECK (((placement IS NULL) OR (placement = ANY (ARRAY['won'::text, 'runnerUp'::text, 'topFive'::text, 'cashed'::text, 'madeCut'::text, 'none'::text]))));
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_bowler_id_fkey FOREIGN KEY (bowler_id) REFERENCES bowler_names(id) ON DELETE SET NULL;
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_leagues ADD CONSTRAINT user_leagues_pkey PRIMARY KEY (user_id, league_id);
ALTER TABLE public.user_leagues ADD CONSTRAINT user_leagues_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE;
ALTER TABLE public.user_leagues ADD CONSTRAINT user_leagues_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_preferences ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id);
ALTER TABLE public.user_preferences ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);
ALTER TABLE public.user_preferences ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX ai_token_usage_report_idx ON public.ai_token_usage USING btree (called_at DESC, endpoint, model);
CREATE INDEX api_usage_lookup_idx ON public.api_usage USING btree (user_id, endpoint, called_at DESC);
CREATE INDEX arsenals_bowler_id_idx ON public.arsenals USING btree (bowler_id);
CREATE INDEX bags_bowler_id_idx ON public.bags USING btree (bowler_id);
CREATE INDEX bags_lookup_idx ON public.bags USING btree (created_by, bowler_name);
CREATE INDEX ball_bags_bowler_id_idx ON public.ball_bags USING btree (bowler_id);
CREATE INDEX ball_bags_lookup_idx ON public.ball_bags USING btree (created_by, bowler_name);
CREATE INDEX ball_confirmations_submission_idx ON public.ball_confirmations USING btree (submission_id);
CREATE INDEX ball_groups_bowler_id_idx ON public.ball_groups USING btree (bowler_id);
CREATE INDEX ball_groups_lookup_idx ON public.ball_groups USING btree (created_by, bowler_name);
CREATE INDEX ball_submissions_key_idx ON public.ball_submissions USING btree (ball_key);
CREATE UNIQUE INDEX ball_submissions_official_key_idx ON public.ball_submissions USING btree (ball_key) WHERE (official = true);
CREATE INDEX bowler_goals_bowler_id_idx ON public.bowler_goals USING btree (bowler_id);
CREATE UNIQUE INDEX bowler_names_one_self ON public.bowler_names USING btree (created_by) WHERE is_self;
CREATE UNIQUE INDEX bowler_names_owner_name_uniq ON public.bowler_names USING btree (created_by, lower(name));
CREATE INDEX bowler_profiles_bowler_id_idx ON public.bowler_profiles USING btree (bowler_id);
CREATE INDEX bowling_centers_name_idx ON public.bowling_centers USING btree (lower(name));
CREATE INDEX closed_seasons_user_league_idx ON public.closed_seasons USING btree (user_id, league, end_date DESC);
CREATE UNIQUE INDEX coaching_invites_code_open_idx ON public.coaching_invites USING btree (code) WHERE ((code IS NOT NULL) AND (accepted_at IS NULL));
CREATE INDEX coaching_invites_created_by_idx ON public.coaching_invites USING btree (created_by);
CREATE INDEX coaching_notes_relationship_idx ON public.coaching_notes USING btree (relationship_id);
CREATE INDEX coaching_tasks_relationship_idx ON public.coaching_tasks USING btree (relationship_id);
CREATE INDEX drills_bowler_id_idx ON public.drills USING btree (bowler_id);
CREATE INDEX drills_lookup_idx ON public.drills USING btree (user_id, bowler_name, target);
CREATE UNIQUE INDEX entitlements_play_purchase_token_uniq ON public.entitlements USING btree (play_purchase_token) WHERE (play_purchase_token IS NOT NULL);
CREATE UNIQUE INDEX entitlements_stripe_customer_uniq ON public.entitlements USING btree (stripe_customer_id) WHERE (stripe_customer_id IS NOT NULL);
CREATE UNIQUE INDEX entitlements_stripe_subscription_uniq ON public.entitlements USING btree (stripe_subscription_id) WHERE (stripe_subscription_id IS NOT NULL);
CREATE INDEX friendships_addressee_idx ON public.friendships USING btree (addressee_id);
CREATE INDEX friendships_requester_idx ON public.friendships USING btree (requester_id);
CREATE INDEX hidden_leagues_user_idx ON public.hidden_leagues USING btree (user_id);
CREATE INDEX imported_scores_bowler_idx ON public.imported_scores USING btree (bowler_user_id);
CREATE INDEX imported_scores_team_idx ON public.imported_scores USING btree (team_id, date);
CREATE INDEX lane_patterns_league_id_idx ON public.lane_patterns USING btree (league_id);
CREATE INDEX lane_patterns_team_id_idx ON public.lane_patterns USING btree (team_id);
CREATE UNIQUE INDEX leagues_name_per_user_idx ON public.leagues USING btree (created_by, name);
CREATE INDEX manual_scores_bowler_id_idx ON public.manual_scores USING btree (bowler_id);
CREATE INDEX manual_scores_lookup_idx ON public.manual_scores USING btree (user_id, bowler_name, date, session_seq);
CREATE INDEX matches_league_id_idx ON public.matches USING btree (league_id);
CREATE INDEX matches_team_id_idx ON public.matches USING btree (team_id);
CREATE INDEX oil_patterns_name_idx ON public.oil_patterns USING btree (lower(name));
CREATE INDEX pending_invites_email_idx ON public.pending_invites USING btree (invited_email);
CREATE UNIQUE INDEX pending_invites_signup_code_open_idx ON public.pending_invites USING btree (signup_code) WHERE ((signup_code IS NOT NULL) AND (accepted_at IS NULL));
CREATE INDEX pending_invites_team_id_idx ON public.pending_invites USING btree (team_id);
CREATE INDEX sessions_bowler_id_idx ON public.sessions USING btree (bowler_id);
CREATE INDEX sessions_bowler_name_idx ON public.sessions USING btree (bowler_name);
CREATE UNIQUE INDEX sessions_no_league_uniq ON public.sessions USING btree (user_id, bowler_name, date, session_seq) WHERE (league_id IS NULL);
CREATE INDEX sessions_team_id_idx ON public.sessions USING btree (team_id);
CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);
CREATE INDEX sessions_user_updated_idx ON public.sessions USING btree (user_id, updated_at);
CREATE INDEX shots_bowler_id_idx ON public.shots USING btree (bowler_id);
CREATE INDEX shots_bowler_name_idx ON public.shots USING btree (bowler_name);
CREATE UNIQUE INDEX shots_identity_uniq ON public.shots USING btree (user_id, bowler_name, COALESCE(league_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(league_name, ''::text), date, game, frame, COALESCE(ball_num, 1), session_seq);
CREATE INDEX shots_team_id_idx ON public.shots USING btree (team_id);
CREATE INDEX shots_user_date_idx ON public.shots USING btree (user_id, date);
CREATE INDEX shots_user_id_idx ON public.shots USING btree (user_id);
CREATE INDEX shots_user_updated_idx ON public.shots USING btree (user_id, updated_at);
CREATE UNIQUE INDEX subscription_events_source_event_uniq ON public.subscription_events USING btree (source, event_id);
CREATE INDEX sync_tombstones_lookup_idx ON public.sync_tombstones USING btree (table_name, user_id, deleted_at);
CREATE UNIQUE INDEX team_join_requests_one_open ON public.team_join_requests USING btree (team_id, user_id) WHERE (status = 'pending'::text);
CREATE INDEX team_join_requests_user_idx ON public.team_join_requests USING btree (user_id);
CREATE INDEX team_members_user_id_idx ON public.team_members USING btree (user_id);
CREATE UNIQUE INDEX teams_join_code_key ON public.teams USING btree (join_code);
CREATE INDEX teams_league_id_idx ON public.teams USING btree (league_id);
CREATE INDEX tournaments_bowler_id_idx ON public.tournaments USING btree (bowler_id);
CREATE INDEX tournaments_user_bowler_idx ON public.tournaments USING btree (user_id, bowler_name);
CREATE INDEX user_leagues_league_id_idx ON public.user_leagues USING btree (league_id);
ALTER TABLE public.ai_token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arsenals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ball_bags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ball_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ball_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ball_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bowler_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bowler_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bowler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bowling_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closed_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lane_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oil_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_tombstones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY 'teammates can view each other''s arsenal entries' ON public.arsenals FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = arsenals.created_by)))));
CREATE POLICY 'users can add their own arsenal entries' ON public.arsenals FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can remove their own arsenal entries' ON public.arsenals FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can update their own arsenal entries' ON public.arsenals FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own arsenal entries' ON public.arsenals FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'teammates can view each other''s bags' ON public.bags FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = bags.created_by)))));
CREATE POLICY 'users can delete their own bags' ON public.bags FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can insert their own bags' ON public.bags FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can update their own bags' ON public.bags FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own bags' ON public.bags FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'teammates can view each other''s ball bag assignments' ON public.ball_bags FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = ball_bags.created_by)))));
CREATE POLICY 'users can delete their own ball bag assignments' ON public.ball_bags FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can insert their own ball bag assignments' ON public.ball_bags FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can update their own ball bag assignments' ON public.ball_bags FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own ball bag assignments' ON public.ball_bags FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'anyone can read confirmations' ON public.ball_confirmations FOR SELECT TO authenticated
  USING ((auth.uid() IS NOT NULL));
CREATE POLICY 'users can change their own vote' ON public.ball_confirmations FOR UPDATE TO authenticated
  USING ((confirmed_by = auth.uid()))
  WITH CHECK ((confirmed_by = auth.uid()));
CREATE POLICY 'users can confirm as themselves' ON public.ball_confirmations FOR INSERT TO authenticated
  WITH CHECK ((confirmed_by = auth.uid()));
CREATE POLICY 'users can withdraw their own confirmation' ON public.ball_confirmations FOR DELETE TO authenticated
  USING ((confirmed_by = auth.uid()));
CREATE POLICY 'teammates can view each other''s ball groups' ON public.ball_groups FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = ball_groups.created_by)))));
CREATE POLICY 'users can delete their own ball groups' ON public.ball_groups FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can insert their own ball groups' ON public.ball_groups FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can update their own ball groups' ON public.ball_groups FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own ball groups' ON public.ball_groups FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'anyone can read ball submissions' ON public.ball_submissions FOR SELECT TO authenticated
  USING ((auth.uid() IS NOT NULL));
CREATE POLICY 'users can delete only their own submission' ON public.ball_submissions FOR DELETE TO authenticated
  USING ((submitted_by = auth.uid()));
CREATE POLICY 'users can insert their own submission' ON public.ball_submissions FOR INSERT TO authenticated
  WITH CHECK ((submitted_by = auth.uid()));
CREATE POLICY 'users can update only their own submission' ON public.ball_submissions FOR UPDATE TO authenticated
  USING ((submitted_by = auth.uid()))
  WITH CHECK ((submitted_by = auth.uid()));
CREATE POLICY 'users can delete their own bowler goals' ON public.bowler_goals FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can insert their own bowler goals' ON public.bowler_goals FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can update their own bowler goals' ON public.bowler_goals FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own bowler goals' ON public.bowler_goals FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'teammates can view each other''s bowler names' ON public.bowler_names FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = bowler_names.created_by)))));
CREATE POLICY 'users can add their own bowler names' ON public.bowler_names FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can remove their own bowler names' ON public.bowler_names FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can update their own bowler names' ON public.bowler_names FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own bowler names' ON public.bowler_names FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can delete their own bowler profiles' ON public.bowler_profiles FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users can insert their own bowler profiles' ON public.bowler_profiles FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can update their own bowler profiles' ON public.bowler_profiles FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'users can view their own bowler profiles' ON public.bowler_profiles FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'anyone can read bowling centers' ON public.bowling_centers FOR SELECT TO authenticated
  USING ((auth.uid() IS NOT NULL));
CREATE POLICY 'creators can correct their own hand-entered centers' ON public.bowling_centers FOR UPDATE TO authenticated
  USING (((created_by = auth.uid()) AND (here_id IS NULL)))
  WITH CHECK (((created_by = auth.uid()) AND (here_id IS NULL)));
CREATE POLICY 'signed-in users can add centers' ON public.bowling_centers FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() IS NOT NULL));
CREATE POLICY 'own closed seasons: delete' ON public.closed_seasons FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'own closed seasons: insert' ON public.closed_seasons FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'own closed seasons: select' ON public.closed_seasons FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'creators revoke their own coaching invites' ON public.coaching_invites FOR DELETE TO authenticated
  USING (((created_by = auth.uid()) AND (accepted_at IS NULL)));
CREATE POLICY 'creators see their own coaching invites' ON public.coaching_invites FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'users create their own coaching invites' ON public.coaching_invites FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'authors can delete their own notes' ON public.coaching_notes FOR DELETE TO authenticated
  USING ((author_id = auth.uid()));
CREATE POLICY 'authors can edit their own notes' ON public.coaching_notes FOR UPDATE TO authenticated
  USING ((author_id = auth.uid()))
  WITH CHECK ((author_id = auth.uid()));
CREATE POLICY 'both sides can view notes' ON public.coaching_notes FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_notes.relationship_id) AND (r.status = 'accepted'::text) AND ((r.coach_id = auth.uid()) OR (r.bowler_id = auth.uid()))))));
CREATE POLICY 'both sides can write notes' ON public.coaching_notes FOR INSERT TO authenticated
  WITH CHECK (((author_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_notes.relationship_id) AND (r.status = 'accepted'::text) AND ((r.coach_id = auth.uid()) OR (r.bowler_id = auth.uid())))))));
CREATE POLICY 'either side can end a coaching relationship' ON public.coaching_relationships FOR DELETE TO authenticated
  USING (((coach_id = auth.uid()) OR (bowler_id = auth.uid())));
CREATE POLICY 'either side can view their coaching relationship' ON public.coaching_relationships FOR SELECT TO authenticated
  USING (((coach_id = auth.uid()) OR (bowler_id = auth.uid())));
CREATE POLICY 'the other side answers a coaching request' ON public.coaching_relationships FOR UPDATE TO authenticated
  USING (((auth.uid() <> requested_by) AND ((auth.uid() = coach_id) OR (auth.uid() = bowler_id))))
  WITH CHECK (((auth.uid() <> requested_by) AND ((auth.uid() = coach_id) OR (auth.uid() = bowler_id))));
CREATE POLICY 'users can request a coaching relationship' ON public.coaching_relationships FOR INSERT TO authenticated
  WITH CHECK (((requested_by = auth.uid()) AND ((coach_id = auth.uid()) OR (bowler_id = auth.uid())) AND (coach_id <> bowler_id) AND (status = 'pending'::text)));
CREATE POLICY 'both sides can update tasks' ON public.coaching_tasks FOR UPDATE TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_tasks.relationship_id) AND (r.status = 'accepted'::text) AND ((r.coach_id = auth.uid()) OR (r.bowler_id = auth.uid()))))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_tasks.relationship_id) AND (r.status = 'accepted'::text) AND ((r.coach_id = auth.uid()) OR (r.bowler_id = auth.uid()))))));
CREATE POLICY 'both sides can view tasks' ON public.coaching_tasks FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_tasks.relationship_id) AND (r.status = 'accepted'::text) AND ((r.coach_id = auth.uid()) OR (r.bowler_id = auth.uid()))))));
CREATE POLICY 'the coach can assign tasks' ON public.coaching_tasks FOR INSERT TO authenticated
  WITH CHECK (((assigned_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_tasks.relationship_id) AND (r.status = 'accepted'::text) AND (r.coach_id = auth.uid()))))));
CREATE POLICY 'the coach can remove tasks' ON public.coaching_tasks FOR DELETE TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM coaching_relationships r
  WHERE ((r.id = coaching_tasks.relationship_id) AND (r.status = 'accepted'::text) AND (r.coach_id = auth.uid())))));
CREATE POLICY 'users manage their own drills' ON public.drills FOR ALL TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'read own entitlement' ON public.entitlements FOR SELECT TO authenticated
  USING ((auth.uid() = user_id));
CREATE POLICY 'either side can delete a friendship' ON public.friendships FOR DELETE TO authenticated
  USING (((requester_id = auth.uid()) OR (addressee_id = auth.uid())));
CREATE POLICY 'only the addressee can answer a friend request' ON public.friendships FOR UPDATE TO authenticated
  USING ((addressee_id = auth.uid()))
  WITH CHECK ((addressee_id = auth.uid()));
CREATE POLICY 'users can send friend requests' ON public.friendships FOR INSERT TO authenticated
  WITH CHECK (((requester_id = auth.uid()) AND (addressee_id <> auth.uid()) AND (status = 'pending'::text)));
CREATE POLICY 'users can view friendships they''re part of' ON public.friendships FOR SELECT TO authenticated
  USING (((requester_id = auth.uid()) OR (addressee_id = auth.uid())));
CREATE POLICY 'users can hide leagues for themselves' ON public.hidden_leagues FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can unhide their own leagues' ON public.hidden_leagues FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'users can update their own hidden leagues' ON public.hidden_leagues FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can view their own hidden leagues' ON public.hidden_leagues FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'bowler or team can update imported scores' ON public.imported_scores FOR UPDATE TO authenticated
  USING (((bowler_user_id = auth.uid()) OR ((team_id IS NOT NULL) AND is_team_member(team_id))))
  WITH CHECK (((bowler_user_id = auth.uid()) OR ((team_id IS NOT NULL) AND is_team_member(team_id))));
CREATE POLICY 'team can view imported scores' ON public.imported_scores FOR SELECT TO authenticated
  USING (((bowler_user_id = auth.uid()) OR (uploaded_by = auth.uid()) OR ((team_id IS NOT NULL) AND is_team_member(team_id))));
CREATE POLICY 'teammates can upload scores' ON public.imported_scores FOR INSERT TO authenticated
  WITH CHECK (((uploaded_by = auth.uid()) AND ((bowler_user_id IS NULL) OR (bowler_user_id = auth.uid()) OR ((team_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = imported_scores.team_id) AND (tm.user_id = imported_scores.bowler_user_id))))) OR ((team_id IS NULL) AND (EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = imported_scores.bowler_user_id)))))) AND ((team_id IS NULL) OR is_team_member(team_id))));
CREATE POLICY 'uploader can delete their upload' ON public.imported_scores FOR DELETE TO authenticated
  USING ((uploaded_by = auth.uid()));
CREATE POLICY 'team members can delete their team''s lane patterns' ON public.lane_patterns FOR DELETE TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'team members can log lane patterns for their team' ON public.lane_patterns FOR INSERT TO authenticated
  WITH CHECK (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'team members can update their team''s lane patterns' ON public.lane_patterns FOR UPDATE TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)))
  WITH CHECK (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'team members can view their team''s lane patterns' ON public.lane_patterns FOR SELECT TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'bowlers in the league can update it' ON public.leagues FOR UPDATE TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM user_leagues ul
  WHERE ((ul.league_id = leagues.id) AND (ul.user_id = auth.uid())))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM user_leagues ul
  WHERE ((ul.league_id = leagues.id) AND (ul.user_id = auth.uid())))));
CREATE POLICY 'league members or its creator can update it' ON public.leagues FOR UPDATE TO authenticated
  USING ((is_league_member(id) OR (created_by = auth.uid())))
  WITH CHECK ((is_league_member(id) OR (created_by = auth.uid())));
CREATE POLICY 'leagues are viewable by any authenticated user' ON public.leagues FOR SELECT TO authenticated
  USING (true);
CREATE POLICY 'users can create leagues as themselves' ON public.leagues FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'teammates can view each other''s manual scores' ON public.manual_scores FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = manual_scores.user_id)))));
CREATE POLICY 'users can delete their own manual scores' ON public.manual_scores FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'users can insert their own manual scores' ON public.manual_scores FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can update their own manual scores' ON public.manual_scores FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can view their own manual scores' ON public.manual_scores FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'team members can delete their team''s matches' ON public.matches FOR DELETE TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'team members can log matches for their team' ON public.matches FOR INSERT TO authenticated
  WITH CHECK (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'team members can update their team''s matches' ON public.matches FOR UPDATE TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)))
  WITH CHECK (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'team members can view their team''s matches' ON public.matches FOR SELECT TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'anyone can read oil patterns' ON public.oil_patterns FOR SELECT TO authenticated
  USING ((auth.uid() IS NOT NULL));
CREATE POLICY 'creators can correct their own unverified patterns' ON public.oil_patterns FOR UPDATE TO authenticated
  USING (((created_by = auth.uid()) AND (verified = false)))
  WITH CHECK (((created_by = auth.uid()) AND (verified = false)));
CREATE POLICY 'signed-in users can add patterns' ON public.oil_patterns FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() IS NOT NULL));
CREATE POLICY 'invitees can answer their own invites' ON public.pending_invites FOR UPDATE TO authenticated
  USING ((lower(invited_email) = lower((auth.jwt() ->> 'email'::text))))
  WITH CHECK ((lower(invited_email) = lower((auth.jwt() ->> 'email'::text))));
CREATE POLICY 'invitees can view their own invites' ON public.pending_invites FOR SELECT TO authenticated
  USING ((lower(invited_email) = lower((auth.jwt() ->> 'email'::text))));
CREATE POLICY 'team members can create invites for their teams' ON public.pending_invites FOR INSERT TO authenticated
  WITH CHECK (is_team_member(team_id));
CREATE POLICY 'team members can delete pending invites for their teams' ON public.pending_invites FOR DELETE TO authenticated
  USING (is_team_member(team_id));
CREATE POLICY 'team members can manually link a placeholder to any account' ON public.pending_invites FOR UPDATE TO authenticated
  USING ((is_team_member(team_id) AND (accepted_at IS NULL)))
  WITH CHECK (is_team_member(team_id));
CREATE POLICY 'team members can view pending invites for their teams' ON public.pending_invites FOR SELECT TO authenticated
  USING (is_team_member(team_id));
CREATE POLICY 'users can claim invites addressed to their own email' ON public.pending_invites FOR UPDATE TO authenticated
  USING (((accepted_at IS NULL) AND (invited_email = (auth.jwt() ->> 'email'::text))))
  WITH CHECK ((accepted_user_id = auth.uid()));
CREATE POLICY 'users can view invites addressed to their own email' ON public.pending_invites FOR SELECT TO authenticated
  USING (((accepted_at IS NULL) AND (invited_email = (auth.jwt() ->> 'email'::text))));
CREATE POLICY 'profiles are viewable by any authenticated user' ON public.profiles FOR SELECT TO authenticated
  USING (true);
CREATE POLICY 'users can insert their own profile' ON public.profiles FOR INSERT TO authenticated
  WITH CHECK ((id = auth.uid()));
CREATE POLICY 'users can update their own profile' ON public.profiles FOR UPDATE TO authenticated
  USING ((id = auth.uid()))
  WITH CHECK ((id = auth.uid()));
CREATE POLICY 'coaches can view their bowler''s sessions' ON public.sessions FOR SELECT TO authenticated
  USING (is_accepted_coach_of(user_id));
CREATE POLICY 'friends can view each other''s sessions' ON public.sessions FOR SELECT TO authenticated
  USING (are_friends(user_id));
CREATE POLICY 'teammates can view each other''s sessions' ON public.sessions FOR SELECT TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'users can delete their own sessions' ON public.sessions FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'users can insert their own sessions' ON public.sessions FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can update their own sessions' ON public.sessions FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can view their own sessions' ON public.sessions FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'coaches can view their bowler''s shots' ON public.shots FOR SELECT TO authenticated
  USING (is_accepted_coach_of(user_id));
CREATE POLICY 'friends can view each other''s shots' ON public.shots FOR SELECT TO authenticated
  USING (are_friends(user_id));
CREATE POLICY 'teammates can view each other''s shots' ON public.shots FOR SELECT TO authenticated
  USING (((team_id IS NOT NULL) AND is_team_member(team_id)));
CREATE POLICY 'users can delete their own shots' ON public.shots FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'users can insert their own shots' ON public.shots FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can update their own shots' ON public.shots FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can view their own shots' ON public.shots FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'user can read their own tombstones' ON public.sync_tombstones FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'see requests about you or your team' ON public.team_join_requests FOR SELECT TO authenticated
  USING (((user_id = auth.uid()) OR is_team_member(team_id)));
CREATE POLICY 'leave a team, or the creator removes a member' ON public.team_members FOR DELETE TO authenticated
  USING (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM teams t
  WHERE ((t.id = team_members.team_id) AND (t.created_by = auth.uid()))))));
CREATE POLICY 'team members can reorder their team''s roster' ON public.team_members FOR UPDATE TO authenticated
  USING (is_team_member(team_id))
  WITH CHECK (is_team_member(team_id));
CREATE POLICY 'team members can view their own roster' ON public.team_members FOR SELECT TO authenticated
  USING (is_team_member(team_id));
CREATE POLICY 'you can only add yourself to a roster' ON public.team_members FOR INSERT TO authenticated
  WITH CHECK (((user_id = auth.uid()) AND ((EXISTS ( SELECT 1
   FROM teams
  WHERE ((teams.id = team_members.team_id) AND (teams.created_by = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM pending_invites
  WHERE ((pending_invites.team_id = team_members.team_id) AND (lower(pending_invites.invited_email) = lower((auth.jwt() ->> 'email'::text))) AND (pending_invites.accepted_at IS NULL)))))));
CREATE POLICY 'only the team creator can delete the team' ON public.teams FOR DELETE TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'team creators can rename their team' ON public.teams FOR UPDATE TO authenticated
  USING ((created_by = auth.uid()))
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'team creators can view their team' ON public.teams FOR SELECT TO authenticated
  USING ((created_by = auth.uid()));
CREATE POLICY 'team members can rename their team' ON public.teams FOR UPDATE TO authenticated
  USING (is_team_member(id))
  WITH CHECK (is_team_member(id));
CREATE POLICY 'team members can view their team' ON public.teams FOR SELECT TO authenticated
  USING (is_team_member(id));
CREATE POLICY 'users can create teams as themselves' ON public.teams FOR INSERT TO authenticated
  WITH CHECK ((created_by = auth.uid()));
CREATE POLICY 'teammates can view each other''s tournaments' ON public.tournaments FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM (team_members me
     JOIN team_members them ON ((them.team_id = me.team_id)))
  WHERE ((me.user_id = auth.uid()) AND (them.user_id = tournaments.user_id)))));
CREATE POLICY 'users can delete their own tournaments' ON public.tournaments FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'users can insert their own tournaments' ON public.tournaments FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can update their own tournaments' ON public.tournaments FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can view their own tournaments' ON public.tournaments FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'bowlers add to their own league list' ON public.user_leagues FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'bowlers remove from their own league list' ON public.user_leagues FOR DELETE TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'bowlers see their own league list' ON public.user_leagues FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE POLICY 'users can insert their own preferences' ON public.user_preferences FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can update their own preferences' ON public.user_preferences FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));
CREATE POLICY 'users can view their own preferences' ON public.user_preferences FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));
CREATE TRIGGER arsenals_link_bowler BEFORE INSERT OR UPDATE ON public.arsenals FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('created_by');
CREATE TRIGGER bags_link_bowler BEFORE INSERT OR UPDATE ON public.bags FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('created_by');
CREATE TRIGGER ball_bags_link_bowler BEFORE INSERT OR UPDATE ON public.ball_bags FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('created_by');
CREATE TRIGGER ball_groups_link_bowler BEFORE INSERT OR UPDATE ON public.ball_groups FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('created_by');
CREATE TRIGGER bowler_goals_link_bowler BEFORE INSERT OR UPDATE ON public.bowler_goals FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('created_by');
CREATE TRIGGER bowler_profiles_link_bowler BEFORE INSERT OR UPDATE ON public.bowler_profiles FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('created_by');
CREATE TRIGGER drills_link_bowler BEFORE INSERT OR UPDATE ON public.drills FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('user_id');
CREATE TRIGGER entitlements_set_updated_at BEFORE UPDATE ON public.entitlements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER imported_scores_guard BEFORE UPDATE ON public.imported_scores FOR EACH ROW EXECUTE FUNCTION imported_scores_guard();
CREATE TRIGGER leagues_add_creator AFTER INSERT ON public.leagues FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER leagues_owner_guard BEFORE UPDATE ON public.leagues FOR EACH ROW EXECUTE FUNCTION leagues_owner_guard();
CREATE TRIGGER leagues_rename_guard BEFORE UPDATE OF name ON public.leagues FOR EACH ROW EXECUTE FUNCTION leagues_rename_guard();
CREATE TRIGGER manual_scores_add_league AFTER INSERT OR UPDATE OF league_id ON public.manual_scores FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER manual_scores_link_bowler BEFORE INSERT OR UPDATE ON public.manual_scores FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('user_id');
CREATE TRIGGER pending_invites_guard BEFORE UPDATE ON public.pending_invites FOR EACH ROW EXECUTE FUNCTION pending_invites_guard();
CREATE TRIGGER sessions_add_league AFTER INSERT OR UPDATE OF league_id ON public.sessions FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER sessions_link_bowler BEFORE INSERT OR UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('user_id');
CREATE TRIGGER sessions_record_tombstone AFTER DELETE ON public.sessions FOR EACH ROW EXECUTE FUNCTION record_tombstone();
CREATE TRIGGER sessions_set_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER shots_link_bowler BEFORE INSERT OR UPDATE ON public.shots FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('user_id');
CREATE TRIGGER shots_record_tombstone AFTER DELETE ON public.shots FOR EACH ROW EXECUTE FUNCTION record_tombstone();
CREATE TRIGGER shots_set_updated_at BEFORE UPDATE ON public.shots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER team_members_add_league AFTER INSERT ON public.team_members FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER team_members_guard BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION team_members_guard();
CREATE TRIGGER team_members_one_per_league AFTER INSERT ON public.team_members FOR EACH ROW EXECUTE FUNCTION team_members_one_per_league();
CREATE TRIGGER teams_member_guard BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION teams_member_guard();
CREATE TRIGGER tournaments_link_bowler BEFORE INSERT OR UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION link_row_to_bowler('user_id');
