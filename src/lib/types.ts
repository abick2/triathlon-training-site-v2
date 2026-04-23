export type Sport = 'run' | 'bike' | 'swim' | 'strength' | 'rest';
export type WorkoutType = 'Easy' | 'Tempo' | 'Long' | 'Threshold' | 'Race' | 'Rest' | 'Recovery';
export type Phase = 'Base' | 'Building' | 'Peak' | 'Taper' | 'Race Week';

export interface RunDetails {
  distance_miles?: number;
  pace_target?: string;
  intervals?: string;
}

export interface BikeDetails {
  distance_miles?: number;
  duration_min?: number;
  power_target?: string;
  hr_zone?: number;
}

export interface SwimDetails {
  distance_yards?: number;
  distance_meters?: number;
  sets?: string;
  rest_intervals?: string;
  stroke?: string;
}

export interface StrengthDetails {
  duration_min?: number;
  focus?: string;
}

export type PlannedDetails = RunDetails & BikeDetails & SwimDetails & StrengthDetails;

export interface Workout {
  id: string;
  week_id: string;
  day_of_week: number;
  sport: Sport;
  workout_type: WorkoutType;
  title: string;
  description: string | null;
  planned_details: PlannedDetails | null;
  completed: boolean;
}

export interface PlanWeek {
  id: string;
  plan_id: string;
  week_number: number;
  phase: Phase;
  week_label: string | null;
  notes: string | null;
  swim_total: number;
  bike_total: number;
  run_total: number;
  workouts: Workout[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  total_weeks: number;
  start_date: string | Date;
  goal: string | null;
  created_at: string;
  weeks: PlanWeek[];
}

export interface TodayInfo {
  weekNumber: number;
  dayOfWeek: number;
}
