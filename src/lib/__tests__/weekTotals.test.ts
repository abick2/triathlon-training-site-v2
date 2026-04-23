import { describe, it, expect } from 'vitest';
import { computeWeekTotals } from '../queries';
import type { Workout } from '../types';

function makeWorkout(overrides: Partial<Workout>): Workout {
  return {
    id: 'test-id',
    week_id: 'week-id',
    day_of_week: 0,
    sport: 'rest',
    workout_type: 'Rest',
    title: 'Test',
    description: null,
    planned_details: null,
    completed: false,
    ...overrides,
  };
}

describe('computeWeekTotals', () => {
  it('returns zeros when given an empty workout list', () => {
    expect(computeWeekTotals([])).toEqual({ swim_total: 0, bike_total: 0, run_total: 0 });
  });

  it('sums swim distance_yards only from swim workouts', () => {
    const workouts = [
      makeWorkout({ sport: 'swim', planned_details: { distance_yards: 1500 } }),
      makeWorkout({ sport: 'swim', planned_details: { distance_yards: 2500 } }),
    ];
    const { swim_total } = computeWeekTotals(workouts);
    expect(swim_total).toBe(4000);
  });

  it('sums bike distance_miles only from bike workouts', () => {
    const workouts = [
      makeWorkout({ sport: 'bike', planned_details: { distance_miles: 22 } }),
      makeWorkout({ sport: 'bike', planned_details: { distance_miles: 36 } }),
    ];
    const { bike_total } = computeWeekTotals(workouts);
    expect(bike_total).toBe(58);
  });

  it('sums run distance_miles only from run workouts', () => {
    const workouts = [
      makeWorkout({ sport: 'run', planned_details: { distance_miles: 9 } }),
      makeWorkout({ sport: 'run', planned_details: { distance_miles: 5 } }),
      makeWorkout({ sport: 'run', planned_details: { distance_miles: 3 } }),
      makeWorkout({ sport: 'run', planned_details: { distance_miles: 12 } }),
    ];
    const { run_total } = computeWeekTotals(workouts);
    expect(run_total).toBe(29);
  });

  it('does not cross-contaminate sport totals', () => {
    const workouts = [
      makeWorkout({ sport: 'swim', planned_details: { distance_yards: 1000 } }),
      makeWorkout({ sport: 'bike', planned_details: { distance_miles: 20 } }),
      makeWorkout({ sport: 'run',  planned_details: { distance_miles: 5  } }),
    ];
    expect(computeWeekTotals(workouts)).toEqual({ swim_total: 1000, bike_total: 20, run_total: 5 });
  });

  it('ignores rest and strength workouts', () => {
    const workouts = [
      makeWorkout({ sport: 'rest',     planned_details: null }),
      makeWorkout({ sport: 'strength', planned_details: { duration_min: 45 } }),
    ];
    expect(computeWeekTotals(workouts)).toEqual({ swim_total: 0, bike_total: 0, run_total: 0 });
  });

  it('ignores workouts with null planned_details', () => {
    const workouts = [
      makeWorkout({ sport: 'run', planned_details: null }),
      makeWorkout({ sport: 'swim', planned_details: null }),
    ];
    expect(computeWeekTotals(workouts)).toEqual({ swim_total: 0, bike_total: 0, run_total: 0 });
  });

  it('ignores workouts missing the relevant distance field', () => {
    const workouts = [
      // bike with only duration_min, no distance_miles
      makeWorkout({ sport: 'bike', planned_details: { duration_min: 60 } }),
      // swim with distance_meters but no distance_yards
      makeWorkout({ sport: 'swim', planned_details: { distance_meters: 1000 } }),
    ];
    expect(computeWeekTotals(workouts)).toEqual({ swim_total: 0, bike_total: 0, run_total: 0 });
  });

  it('matches actual week 1 DB values: swim=4000, bike=58, run=29', () => {
    // These match the workouts in week 1 of the Training Website V2 plan
    const workouts = [
      makeWorkout({ sport: 'bike', planned_details: { distance_miles: 22 } }),
      makeWorkout({ sport: 'bike', planned_details: { distance_miles: 36 } }),
      makeWorkout({ sport: 'run',  planned_details: { distance_miles: 9  } }),
      makeWorkout({ sport: 'run',  planned_details: { distance_miles: 5  } }),
      makeWorkout({ sport: 'run',  planned_details: { distance_miles: 3  } }),
      makeWorkout({ sport: 'run',  planned_details: { distance_miles: 12 } }),
      makeWorkout({ sport: 'swim', planned_details: { distance_yards: 1500 } }),
      makeWorkout({ sport: 'swim', planned_details: { distance_yards: 2500 } }),
    ];
    expect(computeWeekTotals(workouts)).toEqual({ swim_total: 4000, bike_total: 58, run_total: 29 });
  });
});
