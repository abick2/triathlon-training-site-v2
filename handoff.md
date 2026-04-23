# Handoff — Triathlon Training Site v2

**Date:** 2026-04-22  
**Branch:** main  
**Last commit:** `42a9c8d` Fix week progress to count days not workouts; update CLAUDE.md

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
| Deploy | — (not yet configured) |

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

> ⚠️ The TypeScript types in `src/lib/types.ts` model these as flat optional fields. The actual DB data uses `intervals` and `sets` as arrays, not strings — the types lag the reality.

**Current data:** One plan — "General-Prep Build Block (Apr–May 2026)", 4 weeks, starts 2026-04-27.

---

## App Structure

```
src/
  app/
    page.tsx          — redirects / → /today
    layout.tsx        — shell: header, TopNav (desktop), Nav (mobile bottom bar)
    today/page.tsx    — server component: today's workout hero card + week strip
    week/
      page.tsx        — server component: fetches plan, passes to WeekContent
      WeekContent.tsx — client component: week selector + day list
    plan/page.tsx     — server component: overall plan progress + week list
  lib/
    db.ts             — neon() client, reads DATABASE_URL
    queries.ts        — getActivePlan(), getTodayInfo(), workoutSummary()
    types.ts          — TrainingPlan, PlanWeek, Workout, TodayInfo interfaces
  components/
    Badge.tsx         — sport/type pill badge
    ProgressBar.tsx   — thin progress bar
    Nav.tsx           — bottom mobile nav
    TopNav.tsx        — desktop top nav (client, uses usePathname)
```

---

## Key Behaviors & Bug Fixes Applied This Session

### `getActivePlan()` — upcoming plan fallback
If no plan has `start_date <= today`, falls back to the next upcoming plan (ordered by `start_date ASC`). This allows the app to show a plan before it officially starts.

### `getTodayInfo()` — robust date parsing
`start_date` comes back from Neon as a JS `Date` object (not a string). The function handles both:
```ts
const startDate = plan.start_date instanceof Date ? plan.start_date : new Date(plan.start_date);
const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
```
When the plan hasn't started yet, `daysDiff` is negative; `weekNumber` and `dayOfWeek` are clamped to valid ranges (min 1 / min 0).

### Week progress counter — count days, not workouts
Some days have double sessions (AM run + PM swim). The "X / 7 days done" strip on `/today` uses `Set` over `day_of_week` to count distinct days.

### WeekContent day labels — use `workout.day_of_week`, not array index
With multiple workouts per day, the array index `i` doesn't correspond to the day of the week. Fixed to use `workout.day_of_week` for both the `DAYS_SHORT` label and the `isPast`/`isToday` logic.

---

## Environment

```
DATABASE_URL=postgresql://...@ep-shiny-dream-anylco98.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Set in `.env.local` (gitignored). See `.env.local.example` for the format.

---

## Known Gaps / Next Steps

- `intervals` (run) and `sets` (swim) in `planned_details` are arrays in the DB but typed as `string` in `types.ts` — rendering them raw will fail or look wrong
- No workout completion toggling — `completed` field exists in DB but nothing writes to it
- No deploy target configured yet
- Session count on `/plan` page counts all workout records including doubles — should count distinct days like `/today` does
