@AGENTS.md

# Project

Personal triathlon training tracker for Andrew. Next.js 16 App Router, TypeScript, Neon (serverless Postgres), CSS Modules. Single-user, no auth. Data is managed via a separate Claude.ai coaching project and written directly to Neon.

See `handoff.md` for full architecture, schema, and known issues.

## Key facts

- `start_date` from Neon arrives as a JS `Date` object, not a string — handle with `instanceof Date` check
- `planned_details` is JSONB; `intervals` (run) and `sets` (swim) are arrays in the DB despite being typed as `string` in `types.ts`
- Some days have double sessions (AM + PM) — always count distinct `day_of_week` values, never raw `workouts.length`, when representing days
- `day_of_week` is 0=Monday … 6=Sunday
- `TopNav` is shown on all screen sizes; bottom `Nav` is hidden everywhere (dead code)
- Calendar dates on weekly view are computed in `WeekContent` via `planStartDate` prop passed from `week/page.tsx`
- Vercel deployment requires `DATABASE_URL` set manually in Vercel env vars (use pooled Neon connection string)
- Neon returns NUMERIC columns as strings — always coerce with `Number(row.value ?? 0)` when reading `swim_total`, `bike_total`, `run_total`
- `plan_weeks` has `swim_total` (yards), `bike_total` (miles), `run_total` (miles) kept in sync by a DB trigger on `workouts` — no manual refresh needed
- Testing: Vitest is set up (`npm test`); tests live in `src/lib/__tests__/`
- **Next.js 16**: `searchParams` in server component pages is a `Promise` — always `await searchParams` before reading keys
- **Day dot centering**: flex `justify-content: center` alone doesn't center wrapped text; also need `width: 100%` on the dot and `text-align: center`
- Plan → Week navigation: week cards on `/plan` are `<Link href="/week?week=N">`; week page reads `?week` param and passes `initialWeekIdx` to `WeekContent`

## Workflow

- After making code changes, always commit and push to main.
- Run `/logoff` at the end of a session to update `handoff.md` and memory.
