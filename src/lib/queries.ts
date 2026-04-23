import { getSql } from './db';
import type { TrainingPlan, PlanWeek, Workout, TodayInfo } from './types';

export async function getActivePlan(): Promise<TrainingPlan | null> {
  let sql;
  try {
    sql = getSql();
  } catch {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];

  let plan: Record<string, unknown>;
  let rows: Record<string, unknown>[];
  try {
    // 1. Find active plan (already started), or fall back to next upcoming plan
    let plans = await sql`
      SELECT * FROM training_plans
      WHERE start_date <= ${today}
      ORDER BY start_date DESC
      LIMIT 1
    `;
    if (!plans.length) {
      plans = await sql`
        SELECT * FROM training_plans
        ORDER BY start_date ASC
        LIMIT 1
      `;
    }
    if (!plans.length) return null;
    plan = plans[0];

    // 2. Fetch all weeks + workouts for this plan in one JOIN
    rows = await sql`
      SELECT
        pw.id          AS week_id,
        pw.plan_id,
        pw.week_number,
        pw.phase,
        pw.week_label,
        pw.notes,
        w.id           AS workout_id,
        w.day_of_week,
        w.sport,
        w.workout_type,
        w.title,
        w.description,
        w.planned_details,
        w.completed
      FROM plan_weeks pw
      LEFT JOIN workouts w ON w.week_id = pw.id
      WHERE pw.plan_id = ${plan.id}
      ORDER BY pw.week_number, w.day_of_week
    `;
  } catch {
    return null;
  }

  // 3. Group flat rows into nested PlanWeek[] with Workout[]
  const weekMap = new Map<string, PlanWeek>();
  for (const r of rows) {
    const row = r as Record<string, unknown>;
    const weekId = row.week_id as string;
    if (!weekMap.has(weekId)) {
      weekMap.set(weekId, {
        id:          weekId,
        plan_id:     row.plan_id as string,
        week_number: row.week_number as number,
        phase:       row.phase as PlanWeek['phase'],
        week_label:  row.week_label as string | null,
        notes:       row.notes as string | null,
        workouts:    [],
      });
    }
    if (row.workout_id) {
      weekMap.get(weekId)!.workouts.push({
        id:              row.workout_id as string,
        week_id:         weekId,
        day_of_week:     row.day_of_week as number,
        sport:           row.sport as Workout['sport'],
        workout_type:    row.workout_type as Workout['workout_type'],
        title:           row.title as string,
        description:     row.description as string | null,
        planned_details: row.planned_details as Workout['planned_details'],
        completed:       row.completed as boolean,
      });
    }
  }

  return {
    id:          plan.id,
    name:        plan.name,
    total_weeks: plan.total_weeks,
    start_date:  plan.start_date,
    goal:        plan.goal,
    created_at:  plan.created_at,
    weeks:       Array.from(weekMap.values()),
  } as TrainingPlan;
}

/** Returns which week number (1-based) and day_of_week (0=Mon) is "today". */
export function getTodayInfo(plan: TrainingPlan): TodayInfo {
  const start = new Date(plan.start_date.split('T')[0] + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const weekNumber = Math.min(
    Math.max(Math.floor(daysDiff / 7) + 1, 1),
    plan.total_weeks
  );
  const dayOfWeek = Math.min(Math.max(daysDiff % 7, 0), 6);

  return { weekNumber, dayOfWeek };
}

/** Derive a human-readable primary distance/duration string for a workout. */
export function workoutSummary(workout: Workout): string {
  const d = workout.planned_details;
  if (!d) return '';
  if (workout.sport === 'run' && d.distance_miles) {
    return `${d.distance_miles} mi`;
  }
  if (workout.sport === 'bike') {
    if (d.distance_miles) return `${d.distance_miles} mi`;
    if (d.duration_min) return `${d.duration_min} min`;
  }
  if (workout.sport === 'swim') {
    if (d.distance_yards) return `${d.distance_yards} yd`;
    if (d.distance_meters) return `${d.distance_meters} m`;
  }
  if (workout.sport === 'strength' && d.duration_min) {
    return `${d.duration_min} min`;
  }
  return '';
}
