-- Emits the function bodies. Read with `psql -tA`, never wrapped in COPY.
--
-- THE GAP THIS FILLS. generate_schema_sql.sql says plainly that it does
-- not include functions, "because their bodies live in migrations of
-- their own". They did not. There were no migrations, so fourteen
-- functions existed in exactly one place -- the live database -- and
-- nowhere in this repo.
--
-- Thirteen of them are SECURITY DEFINER. Those are not incidental
-- helpers: is_team_member, is_league_member, is_accepted_coach_of and
-- are_friends are what the RLS policies CALL to decide who may read
-- whose scores. The policies were committed; the logic they delegate to
-- was not. A rebuild from this repo produced a database whose policies
-- referenced functions that did not exist, and every one of them would
-- have failed at query time rather than at build time.
--
-- record_tombstone and set_updated_at are worse in a quieter way: they
-- are attached by triggers that generate_schema_sql.sql DOES emit. A
-- rebuild would create the triggers, fail to create the functions, and
-- the delta sync that depends on tombstones would stop working with no
-- error anyone would see until a deletion failed to propagate.
--
-- SECURITY DEFINER is why this file is worth reading rather than
-- skimming: each of these runs with the privileges of its owner and
-- bypasses RLS by design. A change here is a change to who can see what.
--
-- pg_get_functiondef returns the complete CREATE OR REPLACE FUNCTION
-- statement -- signature, volatility, SECURITY DEFINER, search_path
-- setting and body -- so this does not reconstruct anything by hand. It
-- omits only the trailing semicolon, which is added below.
--
-- prokind = 'f' keeps this to plain functions: no aggregates, no window
-- functions, no procedures. Filtering on pg_namespace rather than a name
-- list means a function added next month appears here without anyone
-- remembering to add it.

SELECT pg_get_functiondef(p.oid) || E';\n'
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  -- Extension-owned functions belong to the extension, not to this
  -- schema, and recreating them by hand would conflict with CREATE
  -- EXTENSION on a rebuild.
  AND NOT EXISTS (
    SELECT 1 FROM pg_depend d
    WHERE d.objid = p.oid AND d.deptype = 'e'
  )
ORDER BY p.proname
;
