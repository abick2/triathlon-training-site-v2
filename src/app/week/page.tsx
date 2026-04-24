export const dynamic = 'force-dynamic';

import { getActivePlan, getTodayInfo } from '@/lib/queries';
import WeekContent from './WeekContent';

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const plan = await getActivePlan();

  if (!plan || !plan.weeks.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, padding: '40px 24px', textAlign: 'center', color: 'var(--fg2)', fontSize: 'var(--text-base)' }}>
        <p>No active training plan found.</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg3)' }}>Add a plan via your Claude.ai coaching project.</p>
      </div>
    );
  }

  const { weekNumber, dayOfWeek } = getTodayInfo(plan);
  const totalWeeks = plan.total_weeks;

  const { week: weekParam } = await searchParams;
  const parsed = weekParam ? parseInt(weekParam, 10) : NaN;
  const targetWeekNumber = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 1), totalWeeks)
    : weekNumber;
  const initialWeekIdx = Math.max(0, plan.weeks.findIndex((w) => w.week_number === targetWeekNumber));

  return (
    <WeekContent
      weeks={plan.weeks}
      currentWeekNumber={weekNumber}
      dayOfWeek={dayOfWeek}
      totalWeeks={totalWeeks}
      planStartDate={plan.start_date}
      initialWeekIdx={initialWeekIdx}
    />
  );
}
