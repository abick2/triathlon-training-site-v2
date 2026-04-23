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

## Workflow

- After making code changes, always commit and push to main.
- Run `/logoff` at the end of a session to update `handoff.md` and memory.
