export const dynamic = 'force-dynamic';

import { getActivePlan, getTodayInfo, workoutSummary } from '@/lib/queries';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import styles from './page.module.css';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default async function TodayPage() {
  const plan = await getActivePlan();

  if (!plan || !plan.weeks.length) {
    return (
      <div className={styles.empty}>
        <p>No active training plan found.</p>
        <p className={styles.emptyHint}>Add a plan via your Claude.ai coaching project.</p>
      </div>
    );
  }

  const { weekNumber, dayOfWeek } = getTodayInfo(plan);
  const currentWeek = plan.weeks.find((w) => w.week_number === weekNumber) ?? plan.weeks[0];
  const workout = currentWeek.workouts.find((w) => w.day_of_week === dayOfWeek) ?? currentWeek.workouts[0];
  const tomorrowWorkout = currentWeek.workouts.find((w) => w.day_of_week === (dayOfWeek + 1) % 7) ?? null;

  // Week progress: workouts whose day_of_week falls before today
  const workoutsBeforeToday = currentWeek.workouts.filter((w) => w.day_of_week < dayOfWeek);
  const weekTotal = currentWeek.workouts.length;
  const weekDone  = workoutsBeforeToday.length;

  const summary = workoutSummary(workout);
  const tomorrowSummary = tomorrowWorkout ? workoutSummary(tomorrowWorkout) : '';

  // Estimate duration for runs
  let estTime = '';
  if (workout.sport === 'run' && workout.planned_details?.distance_miles && workout.planned_details?.pace_target) {
    const paceStr = workout.planned_details.pace_target.replace('/mi', '').replace('/km', '');
    const [minStr, secStr] = paceStr.split(':');
    const paceMin = parseFloat(minStr) + (parseFloat(secStr ?? '0') / 60);
    const totalMin = workout.planned_details.distance_miles * paceMin;
    const h = Math.floor(totalMin / 60);
    const m = Math.round(totalMin % 60);
    estTime = h > 0 ? `${h}:${String(m).padStart(2, '0')}` : `${m} min`;
  }

  return (
    <div className={styles.page}>
      {/* Header row */}
      <div className={styles.headerRow}>
        <div>
          <span className="section-label">{DAYS_FULL[dayOfWeek]} · Week {weekNumber}</span>
          <h1 className={styles.title}>
            Today&#39;s<br />Workout
          </h1>
        </div>
        <div className={styles.weekBadge}>
          <span className={styles.weekBadgeNum}>{weekNumber}</span>
          <span className={styles.weekBadgeSub}>of {plan.total_weeks}</span>
        </div>
      </div>

      {/* Hero card */}
      <div className={styles.heroCard}>
        <div className={styles.heroCardBg} />
        <div className={styles.heroCardTop}>
          <Badge workoutType={workout.workout_type} sport={workout.sport} />
          <span className={styles.todayChip}>TODAY</span>
        </div>
        <h2 className={styles.workoutTitle}>{workout.title}</h2>
        {workout.description && (
          <p className={styles.workoutDesc}>{workout.description}</p>
        )}
        {workout.sport !== 'rest' && (
          <div className={styles.statsGrid}>
            {summary && (
              <div>
                <span className={styles.statLabel}>
                  {workout.sport === 'swim' ? 'Distance' : workout.sport === 'bike' ? 'Distance' : 'Miles'}
                </span>
                <span className={`${styles.statValue} mono`}>{summary}</span>
              </div>
            )}
            {workout.sport === 'run' && workout.planned_details?.pace_target && (
              <div>
                <span className={styles.statLabel}>Pace</span>
                <span className={`${styles.statValue} mono`}>{workout.planned_details.pace_target}</span>
              </div>
            )}
            {workout.sport === 'bike' && workout.planned_details?.power_target && (
              <div>
                <span className={styles.statLabel}>Power</span>
                <span className={`${styles.statValue} mono`}>{workout.planned_details.power_target}</span>
              </div>
            )}
            {workout.sport === 'swim' && workout.planned_details?.sets && (
              <div>
                <span className={styles.statLabel}>Sets</span>
                <span className={`${styles.statValue} mono`}>{workout.planned_details.sets}</span>
              </div>
            )}
            {estTime && (
              <div>
                <span className={styles.statLabel}>Est.</span>
                <span className={`${styles.statValue} mono`}>{estTime}</span>
              </div>
            )}
            {workout.planned_details?.intervals && (
              <div className={styles.intervalsRow}>
                <span className={styles.statLabel}>Intervals</span>
                <span className={`${styles.statValue} mono`}>{workout.planned_details.intervals}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Week strip */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className="section-label">This week</span>
          <span className={`${styles.weekCount} mono`}>{weekDone} / {weekTotal} days done</span>
        </div>
        <ProgressBar value={weekDone / weekTotal} color="var(--type-easy)" />
        <div className={styles.dayStrip}>
          {currentWeek.workouts.map((w) => {
            const isDone  = w.day_of_week < dayOfWeek;
            const isToday = w.day_of_week === dayOfWeek;
            return (
              <div key={w.id} className={styles.dayChip}>
                <div
                  className={styles.dayDot}
                  style={{
                    background: isToday
                      ? 'var(--accent)'
                      : isDone
                      ? 'var(--type-complete-bg)'
                      : 'var(--border)',
                    color: isToday
                      ? 'white'
                      : isDone
                      ? 'var(--type-complete)'
                      : 'var(--fg3)',
                  }}
                >
                  {isToday ? '●' : isDone ? '✓' : w.sport === 'rest' ? '–' : workoutSummary(w) || '·'}
                </div>
                <span className={styles.dayLabel}>{DAYS_SHORT[w.day_of_week][0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Up next */}
      {tomorrowWorkout && (
        <div className={styles.upNextCard}>
          <div className={styles.upNextLeft}>
            <span className="section-label">Up next · {DAYS_SHORT[(dayOfWeek + 1) % 7]}</span>
            <span className={styles.upNextTitle}>{tomorrowWorkout.title}</span>
          </div>
          <div className={styles.upNextRight}>
            <Badge workoutType={tomorrowWorkout.workout_type} sport={tomorrowWorkout.sport} small />
            {tomorrowSummary && (
              <span className={`${styles.upNextDist} mono`}>{tomorrowSummary}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
