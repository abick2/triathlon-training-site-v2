'use client';

import { useState } from 'react';
import type { PlanWeek } from '@/lib/types';
import Badge from '@/components/Badge';
import { workoutSummary } from '@/lib/queries';
import styles from './page.module.css';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface WeekContentProps {
  weeks: PlanWeek[];
  currentWeekNumber: number;
  dayOfWeek: number;
  totalWeeks: number;
  planStartDate: string | Date;
  initialWeekIdx: number;
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function workoutDate(planStartDate: string | Date, weekNumber: number, dayOfWeek: number): string {
  const start = planStartDate instanceof Date ? planStartDate : new Date(planStartDate);
  // Use UTC methods throughout: start_date is stored as UTC midnight, and local-timezone
  // methods (getDate etc.) shift the date by -1 in timezones behind UTC.
  const startUtcMs = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const targetMs = startUtcMs + ((weekNumber - 1) * 7 + dayOfWeek) * 86400000;
  const d = new Date(targetMs);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export default function WeekContent({
  weeks,
  currentWeekNumber,
  dayOfWeek,
  totalWeeks,
  planStartDate,
  initialWeekIdx,
}: WeekContentProps) {
  const currentIdx = weeks.findIndex((w) => w.week_number === currentWeekNumber);
  const [selIdx, setSelIdx] = useState(initialWeekIdx);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const week = weeks[selIdx];
  if (!week) return null;

  const isPast   = (i: number) => selIdx < currentIdx || (selIdx === currentIdx && i < dayOfWeek);
  const isToday  = (i: number) => selIdx === currentIdx && i === dayOfWeek;

  const activeWorkouts = week.workouts.filter((w) => w.sport !== 'rest').length;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <span className="section-label">{week.phase}</span>
          <div className={styles.weekTitle}>
            Week {week.week_number}{' '}
            <span className={styles.weekTitleOf}>of {totalWeeks}</span>
          </div>
        </div>
        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={() => { setExpandedDay(null); setSelIdx((i) => Math.max(0, i - 1)); }}
            disabled={selIdx === 0}
            aria-label="Previous week"
          >
            ←
          </button>
          <button
            className={styles.navBtn}
            onClick={() => { setExpandedDay(null); setSelIdx((i) => Math.min(weeks.length - 1, i + 1)); }}
            disabled={selIdx === weeks.length - 1}
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Phase</span>
          <span className={styles.statValue}>{week.phase}</span>
        </div>
        <div className={`${styles.statItem} ${styles.statItemBordered}`}>
          <span className={styles.statLabel}>Sessions</span>
          <span className={styles.statValue}>{activeWorkouts}</span>
          <div className={styles.weekTotals}>
            {week.swim_total > 0 && (
              <span className={styles.weekTotalItem}>
                {week.swim_total.toLocaleString()} yd swim
              </span>
            )}
            {week.bike_total > 0 && (
              <span className={styles.weekTotalItem}>
                {week.bike_total} mi bike
              </span>
            )}
            {week.run_total > 0 && (
              <span className={styles.weekTotalItem}>
                {week.run_total} mi run
              </span>
            )}
          </div>
        </div>
        {week.notes && (
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Note</span>
            <span className={`${styles.statValue} ${styles.statValueSmall}`}>{week.notes}</span>
          </div>
        )}
      </div>

      {/* Day list */}
      <div className={styles.dayList}>
        {week.workouts.map((workout, i) => {
          const done    = isPast(workout.day_of_week);
          const today   = isToday(workout.day_of_week);
          const expanded = expandedDay === i;
          const summary  = workoutSummary(workout);

          return (
            <div
              key={workout.id}
              className={styles.dayRow}
              style={{
                background:   today ? 'var(--neutral-950)' : 'var(--surface)',
                borderColor:  today ? 'var(--accent)' : 'var(--border)',
                borderWidth:  today ? 1.5 : 1,
                boxShadow:    today ? `0 0 0 3px var(--accent-dim)` : 'var(--shadow-md)',
                cursor: workout.description ? 'pointer' : 'default',
              }}
              onClick={() => workout.description && setExpandedDay(expanded ? null : i)}
            >
              <div className={styles.dayRowMain}>
                {/* Day col */}
                <div className={styles.dayCol}>
                  <span
                    className={styles.dayName}
                    style={{ color: today ? 'var(--fg-light)' : 'var(--fg3)' }}
                  >
                    {DAYS_SHORT[workout.day_of_week]}
                  </span>
                  <span
                    className={styles.dayDate}
                    style={{
                      color: done
                        ? 'var(--type-complete)'
                        : today
                        ? 'var(--accent)'
                        : 'var(--fg3)',
                    }}
                  >
                    {workoutDate(planStartDate, week.week_number, workout.day_of_week)}
                  </span>
                </div>

                {/* Title + meta */}
                <div className={styles.dayMeta}>
                  <span
                    className={styles.dayTitle}
                    style={{ color: today ? 'var(--fg-light)' : 'var(--fg1)' }}
                  >
                    {workout.title}
                  </span>
                  {workout.sport !== 'rest' && summary && (
                    <span className={`${styles.daySummary} mono`} style={{ color: 'var(--fg3)' }}>
                      {summary}
                      {workout.sport === 'run' && workout.planned_details?.pace_target
                        ? ` · ${workout.planned_details.pace_target}`
                        : ''}
                    </span>
                  )}
                </div>

                <Badge workoutType={workout.workout_type} sport={workout.sport} small />
              </div>

              {expanded && workout.description && (
                <div
                  className={styles.dayExpanded}
                  style={{
                    borderTopColor: today ? 'var(--neutral-800)' : 'var(--border)',
                    color: today ? 'var(--neutral-400)' : 'var(--fg2)',
                  }}
                >
                  {workout.description}
                  {workout.planned_details?.intervals && (
                    <div className={styles.intervals}>
                      <span className={styles.intervalsLabel}>Intervals</span>
                      <span className="mono">{workout.planned_details.intervals}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
