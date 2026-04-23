# Handoff — Triathlon Training Site v2

**Date:** 2026-04-22  
**Branch:** main  
**Last commit:** `37df01b` Show calendar date (Apr 27) on weekly view day cards

---

## What This Is

A personal Next.js 16 mobile-first training tracker for Andrew's triathlon plan. Data lives in Neon (Postgres). There is no auth — it's a single-user read-only view of training data managed via a Claude.ai coaching project.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | Neon (serverless Postgres) via `@neondatabase/serverless` |
| Styling | CSS Modules + CSS custom properties |
| Fonts | Nunito + DM Mono (Google Fonts) |
| Deploy | Vercel |

---

## Database Schema

Three tables in the `public` schema on Neon:

```
training_plans  — id, name, start_date, total_weeks, goal, created_at
plan_weeks      — id, plan_id, week_number, phase, week_label, notes
workouts        — id, week_id, day_of_week (0=Mon…6=Sun), sport, workout_type,
                  title, description, planned_details (JSONB), completed
```

`planned_details` is a JSONB blob whose shape varies by sport:
- **run**: `distance_miles`, `pace_target`, `intervals` (array of strings), `hr_zone`
- **bike**: `distance_miles`, `duration_min`, `power_target`, `hr_zone`
- **swim**: `distance_yards`, `distance_meters`, `sets` (array of objects), `rest_intervals`, `stroke`
- **strength**: `duration_min`, `focus`

> ⚠️ The TypeScript types in `src/lib/types.ts` model `intervals` and `sets` as flat optional fields typed as `string`. The actual DB data uses arrays — the types lag the reality.

**Current data:** One plan — "General-Prep Build Block (Apr–May 2026)", 4 weeks, starts 2026-04-27.

---

## App Structure

```
src/
  app/
    page.tsx            — redirects / → /today
    layout.tsx          — shell: sticky header with logo + TopNav (all screen sizes)
    today/page.tsx      — server component: today's workout hero card + week strip
    week/
      page.tsx          — server component: fetches plan, passes to WeekContent
      WeekContent.tsx   — client component: week selector + day list with dates
    plan/page.tsx       — server component: overall plan progress + week list
  lib/
    db.ts               — neon() client, reads DATABASE_URL
    queries.ts          — getActivePlan(), getTodayInfo(), workoutSummary()
    types.ts            — TrainingPlan, PlanWeek, Workout, TodayInfo interfaces
  components/
    Badge.tsx           — sport/type pill badge
    ProgressBar.tsx     — thin progress bar
    Nav.tsx             — bottom tab bar (currently hidden on all sizes)
    TopNav.tsx          — header nav links (Today / Week / Plan), shown on all sizes
```

---

## Navigation

- `TopNav` (text links in sticky header) is visible on **all screen sizes** — mobile and desktop.
- `Nav` (bottom icon tab bar) is **hidden on all screen sizes** — kept in code but not displayed.

---

## Key Behaviors & Gotchas

### `getActivePlan()` — upcoming plan fallback
If no plan has `start_date <= today`, falls back to the next upcoming plan. Allows the app to show a plan before it officially starts.

### `getTodayInfo()` — robust date parsing
`start_date` comes back from Neon as a JS `Date` object, not a string. Always handled as:
```ts
const startDate = plan.start_date instanceof Date ? plan.start_date : new Date(plan.start_date);
const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
```

### Week progress — count days, not workouts
Some days have double sessions (AM run + PM swim). All day counting uses `Set` over `day_of_week`:
```ts
const uniqueDays = new Set(currentWeek.workouts.map((w) => w.day_of_week));
```

### WeekContent — use `workout.day_of_week`, not array index
Multiple workouts share the same day. Always use `workout.day_of_week` (not `i`) for day labels, `isPast`/`isToday` logic, and date calculation.

### Weekly view — calendar dates
Each day card shows the actual calendar date ("Apr 27") computed from:
```ts
base.setDate(base.getDate() + (weekNumber - 1) * 7 + dayOfWeek);
```
`planStartDate` is passed from `week/page.tsx` → `WeekContent` as a prop.

### Vercel deployment
`DATABASE_URL` must be set manually in Vercel → Settings → Environment Variables (`.env.local` is gitignored). Use the **pooled** Neon connection string for serverless safety.

---

## Known Gaps / Next Steps

- `intervals` (run) and `sets` (swim) in `planned_details` are arrays in the DB but typed as `string` in `types.ts` — rendering them raw will fail or look wrong
- No workout completion toggling — `completed` field exists in DB but nothing writes to it
- Session count on `/plan` page counts all workout records including doubles — should count distinct days like `/today` does
- `Nav.tsx` (bottom tab bar) is dead code — can be removed or repurposed
