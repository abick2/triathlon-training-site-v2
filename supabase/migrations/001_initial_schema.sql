-- ============================================================
--  Andrew's Training Plan — Initial Schema
--  Run this in the Neon SQL editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── Training Plans ─────────────────────────────────────────
create table training_plans (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  total_weeks int  not null,
  start_date  date not null,
  goal        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Plan Weeks ─────────────────────────────────────────────
create table plan_weeks (
  id          uuid primary key default uuid_generate_v4(),
  plan_id     uuid not null references training_plans(id) on delete cascade,
  week_number int  not null,
  phase       text not null check (phase in ('Base','Building','Peak','Taper','Race Week')),
  week_label  text,
  notes       text,
  unique (plan_id, week_number)
);

-- ── Workouts ───────────────────────────────────────────────
-- planned_details is a flexible JSONB field — sport-specific metrics:
--   run:      { distance_miles, pace_target, intervals }
--   bike:     { distance_miles, duration_min, power_target, hr_zone }
--   swim:     { distance_yards, distance_meters, sets, rest_intervals, stroke }
--   strength: { duration_min, focus }
create table workouts (
  id              uuid primary key default uuid_generate_v4(),
  week_id         uuid not null references plan_weeks(id) on delete cascade,
  day_of_week     int  not null check (day_of_week between 0 and 6), -- 0=Mon, 6=Sun
  sport           text not null check (sport in ('run','bike','swim','strength','rest')),
  workout_type    text not null check (workout_type in ('Easy','Tempo','Long','Threshold','Race','Rest','Recovery','Moderate Progressive')),
  title           text not null,
  description     text,
  planned_details jsonb,
  completed       boolean not null default false
);

-- ── Indexes ────────────────────────────────────────────────
create index on plan_weeks (plan_id);
create index on workouts   (week_id);
create index on workouts   (week_id, day_of_week);
create index on training_plans (start_date);

-- ── Updated_at trigger ─────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger training_plans_updated_at
  before update on training_plans
  for each row execute procedure update_updated_at();

-- ── Sample plan (1 week, to verify schema) ─────────────────
-- Remove or replace with real data once schema is confirmed.
do $$
declare
  v_plan_id uuid;
  v_week_id uuid;
begin
  insert into training_plans (name, total_weeks, start_date, goal)
  values ('Sample Plan', 1, current_date, 'Verify schema')
  returning id into v_plan_id;

  insert into plan_weeks (plan_id, week_number, phase, notes)
  values (v_plan_id, 1, 'Base', 'Sample week — replace with real data')
  returning id into v_week_id;

  insert into workouts (week_id, day_of_week, sport, workout_type, title, description, planned_details) values
    (v_week_id, 0, 'run',  'Easy',  'Easy Run',         'Comfortable effort. Conversational pace.',         '{"distance_miles": 5, "pace_target": "10:00/mi"}'),
    (v_week_id, 1, 'bike', 'Easy',  'Endurance Ride',   'Zone 2 effort. Keep HR steady.',                   '{"distance_miles": 20, "duration_min": 60, "hr_zone": 2}'),
    (v_week_id, 2, 'swim', 'Easy',  'Recovery Swim',    'Easy freestyle, focus on form.',                   '{"distance_yards": 1500, "sets": "10x150 easy", "stroke": "freestyle"}'),
    (v_week_id, 3, 'run',  'Tempo', 'Tempo Run',        '2 mi warm-up, 3 mi at threshold, 1 mi cool-down.','{"distance_miles": 6, "pace_target": "8:00/mi", "intervals": "3 mi @ threshold"}'),
    (v_week_id, 4, 'rest', 'Rest',  'Rest Day',         'Sleep, eat, hydrate.',                             null),
    (v_week_id, 5, 'bike', 'Long',  'Long Ride',        'Build aerobic base. Keep it conversational.',      '{"distance_miles": 40, "duration_min": 120, "hr_zone": 2}'),
    (v_week_id, 6, 'run',  'Long',  'Long Run',         'Start easy. Build to goal pace the last 3 miles.', '{"distance_miles": 10, "pace_target": "9:30/mi"}');
end;
$$;
