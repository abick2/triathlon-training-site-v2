export const dynamic = 'force-dynamic';

import { getActivePlan, getTodayInfo } from '@/lib/queries';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';
import styles from './page.module.css';

export default async function PlanPage() {
  const plan = await getActivePlan();

  if (!plan || !plan.weeks.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, padding: '40px 24px', textAlign: 'center', color: 'var(--fg2)', fontSize: 'var(--text-base)' }}>
        <p>No active training plan found.</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg3)' }}>Add a plan via your Claude.ai coaching project.</p>
      </div>
    );
  }

  const { weekNumber } = getTodayInfo(plan);
  const totalWeeks = plan.total_weeks;
  const doneWeeks  = Math.max(0, weekNumber - 1);
  const progress   = doneWeeks / totalWeeks;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <span className="section-label">{totalWeeks}-Week Plan</span>
        <h1 className={styles.title}>Your Progress</h1>

        {/* Overall progress card */}
        <div className={styles.progressCard}>
          <div className={styles.progressCardTop}>
            <span className={styles.progressLabel}>Plan complete</span>
            <span className={`${styles.progressPct} mono`}>{Math.round(progress * 100)}%</span>
          </div>
          <ProgressBar value={progress} height={8} />
          <div className={styles.progressStats}>
            <div className={styles.progressStat}>
              <span className={styles.progressStatLabel}>Week</span>
              <span className={styles.progressStatValue}>{weekNumber} of {totalWeeks}</span>
            </div>
            <div className={`${styles.progressStat} ${styles.progressStatBordered}`}>
              <span className={styles.progressStatLabel}>Done</span>
              <span className={styles.progressStatValue}>{doneWeeks} wks</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.progressStatLabel}>Remaining</span>
              <span className={styles.progressStatValue}>{totalWeeks - weekNumber} wks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week list */}
      <div className={styles.weekList}>
        {plan.weeks.map((week) => {
          const isDone = week.week_number < weekNumber;
          const isCur  = week.week_number === weekNumber;
          const isFuture = week.week_number > weekNumber;

          // Build intensity strip: proportion of each day's workouts
          const stripColors = week.workouts.map((w) => {
            if (isDone) return 'var(--type-complete)';
            const typeColorMap: Record<string, string> = {
              Easy:      'var(--type-easy)',
              Recovery:  'var(--type-easy)',
              Tempo:     'var(--type-tempo)',
              Threshold: 'var(--type-tempo)',
              Long:      'var(--type-long)',
              Race:      'var(--type-hard)',
              Rest:      'var(--neutral-200)',
            };
            return typeColorMap[w.workout_type] ?? 'var(--neutral-200)';
          });

          return (
            <Link
              key={week.id}
              href={`/week?week=${week.week_number}`}
              className={styles.weekRow}
              style={{
                display:      'flex',
                textDecoration: 'none',
                color:        'inherit',
                background:   isCur ? 'var(--neutral-950)' : 'var(--surface)',
                borderColor:  isCur ? 'var(--accent)' : 'var(--border)',
                borderWidth:  isCur ? 1.5 : 1,
                boxShadow:    isCur ? `0 0 0 3px var(--accent-dim)` : 'var(--shadow-md)',
                opacity:      isFuture ? 0.6 : 1,
              }}
            >
              {/* Week number dot */}
              <div
                className={styles.weekDot}
                style={{
                  background: isDone
                    ? 'var(--type-complete-bg)'
                    : isCur
                    ? 'var(--accent)'
                    : 'var(--neutral-100)',
                  color: isDone
                    ? 'var(--type-complete)'
                    : isCur
                    ? 'white'
                    : 'var(--fg3)',
                }}
              >
                {isDone ? '✓' : week.week_number}
              </div>

              {/* Week info */}
              <div className={styles.weekInfo}>
                <div className={styles.weekInfoTop}>
                  <span
                    className={styles.weekLabel}
                    style={{ color: isCur ? 'var(--fg-light)' : 'var(--fg1)' }}
                  >
                    {week.week_label ?? `Week ${week.week_number}`}
                  </span>
                  {isCur && <span className={styles.nowChip}>NOW</span>}
                </div>
                <span
                  className={styles.phaseLabel}
                  style={{ color: isCur ? 'var(--neutral-600)' : 'var(--fg3)' }}
                >
                  {week.phase}
                </span>
              </div>

              {/* Session count */}
              <div className={styles.sessionCount}>
                <span
                  className={`${styles.sessionNum} mono`}
                  style={{ color: isCur ? 'var(--fg-light)' : 'var(--fg1)' }}
                >
                  {week.workouts.filter((w) => w.sport !== 'rest').length}
                </span>
                <span className={styles.sessionLabel}>sessions</span>
              </div>

              {/* Intensity strip */}
              <div className={styles.intensityStrip}>
                {week.workouts.map((w, j) => (
                  <div
                    key={j}
                    className={styles.intensityBar}
                    style={{
                      flex: 1,
                      background: stripColors[j],
                      opacity: w.sport === 'rest' ? 0.15 : isDone ? 0.6 : 0.5,
                    }}
                  />
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
