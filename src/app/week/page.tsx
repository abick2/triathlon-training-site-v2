export const dynamic = 'force-dynamic';

import { getActivePlan, getTodayInfo } from '@/lib/queries';
import WeekContent from './WeekContent';

export default async function WeekPage() {
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

  return (
    <WeekContent
      weeks={plan.weeks}
      currentWeekNumber={weekNumber}
      dayOfWeek={dayOfWeek}
      totalWeeks={plan.total_weeks}
    />
  );
}
