-- Add weekly volume total columns to plan_weeks
ALTER TABLE plan_weeks
  ADD COLUMN IF NOT EXISTS swim_total  NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bike_total  NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS run_total   NUMERIC DEFAULT 0;

-- Backfill totals from existing workouts
UPDATE plan_weeks pw SET
  swim_total = (
    SELECT COALESCE(SUM((w.planned_details->>'distance_yards')::numeric), 0)
    FROM workouts w
    WHERE w.week_id = pw.id
      AND w.sport = 'swim'
      AND w.planned_details->>'distance_yards' IS NOT NULL
  ),
  bike_total = (
    SELECT COALESCE(SUM((w.planned_details->>'distance_miles')::numeric), 0)
    FROM workouts w
    WHERE w.week_id = pw.id
      AND w.sport = 'bike'
      AND w.planned_details->>'distance_miles' IS NOT NULL
  ),
  run_total = (
    SELECT COALESCE(SUM((w.planned_details->>'distance_miles')::numeric), 0)
    FROM workouts w
    WHERE w.week_id = pw.id
      AND w.sport = 'run'
      AND w.planned_details->>'distance_miles' IS NOT NULL
  );

-- Trigger function: recomputes all three totals for the affected week
CREATE OR REPLACE FUNCTION update_plan_week_totals()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  target_week_id UUID;
BEGIN
  target_week_id := COALESCE(NEW.week_id, OLD.week_id);
  UPDATE plan_weeks SET
    swim_total = (
      SELECT COALESCE(SUM((w.planned_details->>'distance_yards')::numeric), 0)
      FROM workouts w
      WHERE w.week_id = target_week_id
        AND w.sport = 'swim'
        AND w.planned_details->>'distance_yards' IS NOT NULL
    ),
    bike_total = (
      SELECT COALESCE(SUM((w.planned_details->>'distance_miles')::numeric), 0)
      FROM workouts w
      WHERE w.week_id = target_week_id
        AND w.sport = 'bike'
        AND w.planned_details->>'distance_miles' IS NOT NULL
    ),
    run_total = (
      SELECT COALESCE(SUM((w.planned_details->>'distance_miles')::numeric), 0)
      FROM workouts w
      WHERE w.week_id = target_week_id
        AND w.sport = 'run'
        AND w.planned_details->>'distance_miles' IS NOT NULL
    )
  WHERE id = target_week_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_update_week_totals ON workouts;
CREATE TRIGGER trg_update_week_totals
AFTER INSERT OR UPDATE OR DELETE ON workouts
FOR EACH ROW EXECUTE FUNCTION update_plan_week_totals();
