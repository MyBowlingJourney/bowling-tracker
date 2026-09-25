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
  retired_on date
);
CREATE TABLE IF NOT EXISTS public.bags (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  name text NOT NULL,
  bag_type text DEFAULT 'league'::text NOT NULL,
  ball_limit integer,
  includes_plastic boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.ball_bags (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_by uuid,
  bowler_name text NOT NULL,
  ball text NOT NULL,
  bag_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
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
  created_at timestamp with time zone DEFAULT now() NOT NULL
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
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS public.bowler_names (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid DEFAULT gen_random_uuid(),
  name text,
  left_handed boolean DEFAULT false NOT NULL
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
  backup_ball boolean DEFAULT false NOT NULL
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
  session_seq integer DEFAULT 1 NOT NULL
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
  session_seq integer DEFAULT 1 NOT NULL
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
  session_seq integer DEFAULT 1 NOT NULL
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
  session_seq integer DEFAULT 1 NOT NULL
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
  baker_alternate boolean DEFAULT true NOT NULL
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
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_coverstock_check CHECK (((coverstock IS NULL) OR (coverstock = ANY (ARRAY['solid'::text, 'pearl'::text, 'hybrid'::text]))));
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_layout_system_check CHECK (((layout_system IS NULL) OR (layout_system = ANY (ARRAY['dual_angle'::text, 'vls'::text, '2ls'::text]))));
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.arsenals ADD CONSTRAINT arsenals_group_id_fkey FOREIGN KEY (group_id) REFERENCES ball_groups(id) ON DELETE SET NULL;
ALTER TABLE public.bags ADD CONSTRAINT bags_pkey PRIMARY KEY (id);
ALTER TABLE public.bags ADD CONSTRAINT bags_created_by_bowler_name_name_key UNIQUE (created_by, bowler_name, name);
ALTER TABLE public.bags ADD CONSTRAINT bags_bag_type_check CHECK ((bag_type = ANY (ARRAY['league'::text, 'tournament'::text])));
ALTER TABLE public.bags ADD CONSTRAINT bags_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_created_by_bowler_name_ball_bag_id_key UNIQUE (created_by, bowler_name, ball, bag_id);
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_bag_id_fkey FOREIGN KEY (bag_id) REFERENCES bags(id) ON DELETE CASCADE;
ALTER TABLE public.ball_bags ADD CONSTRAINT ball_bags_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_submission_id_confirmed_by_key UNIQUE (submission_id, confirmed_by);
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_vote_check CHECK ((vote = ANY (ARRAY['approve'::text, 'reject'::text])));
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_confirmations ADD CONSTRAINT ball_confirmations_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES ball_submissions(id) ON DELETE CASCADE;
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_created_by_bowler_name_name_key UNIQUE (created_by, bowler_name, name);
ALTER TABLE public.ball_groups ADD CONSTRAINT ball_groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ball_submissions ADD CONSTRAINT ball_submissions_pkey PRIMARY KEY (id);
ALTER TABLE public.ball_submissions ADD CONSTRAINT ball_submissions_submitted_by_ball_key_key UNIQUE (submitted_by, ball_key);
ALTER TABLE public.ball_submissions ADD CONSTRAINT ball_submissions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_pkey PRIMARY KEY (id);
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_created_by_bowler_name_key UNIQUE (created_by, bowler_name);
ALTER TABLE public.bowler_goals ADD CONSTRAINT bowler_goals_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowler_names ADD CONSTRAINT bowler_names_pkey PRIMARY KEY (id);
ALTER TABLE public.bowler_names ADD CONSTRAINT bowler_names_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_created_by_bowler_name_key UNIQUE (created_by, bowler_name);
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_owner_name_key UNIQUE (created_by, bowler_name);
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_all_time_high_game_check CHECK (((all_time_high_game IS NULL) OR ((all_time_high_game >= 0) AND (all_time_high_game <= 300))));
ALTER TABLE public.bowler_profiles ADD CONSTRAINT bowler_profiles_all_time_high_series_check CHECK (((all_time_high_series IS NULL) OR ((all_time_high_series >= 0) AND (all_time_high_series <= 900))));
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
ALTER TABLE public.sessions ADD CONSTRAINT sessions_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public.shots ADD CONSTRAINT shots_pkey PRIMARY KEY (id);
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
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_leagues ADD CONSTRAINT user_leagues_pkey PRIMARY KEY (user_id, league_id);
ALTER TABLE public.user_leagues ADD CONSTRAINT user_leagues_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE;
ALTER TABLE public.user_leagues ADD CONSTRAINT user_leagues_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_preferences ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id);
ALTER TABLE public.user_preferences ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);
ALTER TABLE public.user_preferences ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX ai_token_usage_report_idx ON public.ai_token_usage USING btree (called_at DESC, endpoint, model);
CREATE INDEX api_usage_lookup_idx ON public.api_usage USING btree (user_id, endpoint, called_at DESC);
CREATE INDEX bags_lookup_idx ON public.bags USING btree (created_by, bowler_name);
CREATE INDEX ball_bags_lookup_idx ON public.ball_bags USING btree (created_by, bowler_name);
CREATE INDEX ball_confirmations_submission_idx ON public.ball_confirmations USING btree (submission_id);
CREATE INDEX ball_groups_lookup_idx ON public.ball_groups USING btree (created_by, bowler_name);
CREATE INDEX ball_submissions_key_idx ON public.ball_submissions USING btree (ball_key);
CREATE UNIQUE INDEX ball_submissions_official_key_idx ON public.ball_submissions USING btree (ball_key) WHERE (official = true);
CREATE INDEX bowling_centers_name_idx ON public.bowling_centers USING btree (lower(name));
CREATE INDEX closed_seasons_user_league_idx ON public.closed_seasons USING btree (user_id, league, end_date DESC);
CREATE UNIQUE INDEX coaching_invites_code_open_idx ON public.coaching_invites USING btree (code) WHERE ((code IS NOT NULL) AND (accepted_at IS NULL));
CREATE INDEX coaching_invites_created_by_idx ON public.coaching_invites USING btree (created_by);
CREATE INDEX coaching_notes_relationship_idx ON public.coaching_notes USING btree (relationship_id);
CREATE INDEX coaching_tasks_relationship_idx ON public.coaching_tasks USING btree (relationship_id);
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
CREATE INDEX manual_scores_lookup_idx ON public.manual_scores USING btree (user_id, bowler_name, date, session_seq);
CREATE INDEX matches_league_id_idx ON public.matches USING btree (league_id);
CREATE INDEX matches_team_id_idx ON public.matches USING btree (team_id);
CREATE INDEX oil_patterns_name_idx ON public.oil_patterns USING btree (lower(name));
CREATE INDEX pending_invites_email_idx ON public.pending_invites USING btree (invited_email);
CREATE UNIQUE INDEX pending_invites_signup_code_open_idx ON public.pending_invites USING btree (signup_code) WHERE ((signup_code IS NOT NULL) AND (accepted_at IS NULL));
CREATE INDEX pending_invites_team_id_idx ON public.pending_invites USING btree (team_id);
CREATE INDEX sessions_bowler_name_idx ON public.sessions USING btree (bowler_name);
CREATE UNIQUE INDEX sessions_no_league_uniq ON public.sessions USING btree (user_id, bowler_name, date, session_seq) WHERE (league_id IS NULL);
CREATE INDEX sessions_team_id_idx ON public.sessions USING btree (team_id);
CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);
CREATE INDEX sessions_user_updated_idx ON public.sessions USING btree (user_id, updated_at);
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
  WITH CHECK (((requested_by = auth.uid()) AND ((coach_id = auth.uid()) OR (bowler_id = auth.uid()))));
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
  WITH CHECK ((requester_id = auth.uid()));
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
  WITH CHECK (((uploaded_by = auth.uid()) AND ((team_id IS NULL) OR is_team_member(team_id))));
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
CREATE TRIGGER entitlements_set_updated_at BEFORE UPDATE ON public.entitlements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leagues_add_creator AFTER INSERT ON public.leagues FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER manual_scores_add_league AFTER INSERT OR UPDATE OF league_id ON public.manual_scores FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER sessions_add_league AFTER INSERT OR UPDATE OF league_id ON public.sessions FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
CREATE TRIGGER sessions_record_tombstone AFTER DELETE ON public.sessions FOR EACH ROW EXECUTE FUNCTION record_tombstone();
CREATE TRIGGER sessions_set_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER shots_record_tombstone AFTER DELETE ON public.shots FOR EACH ROW EXECUTE FUNCTION record_tombstone();
CREATE TRIGGER shots_set_updated_at BEFORE UPDATE ON public.shots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER team_members_add_league AFTER INSERT ON public.team_members FOR EACH ROW EXECUTE FUNCTION user_leagues_from_row();
