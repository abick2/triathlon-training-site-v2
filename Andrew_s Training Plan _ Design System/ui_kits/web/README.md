# Web UI Kit — Andrew's Training Plan

## Overview
A full interactive prototype of the training plan web app, built as a mobile-first React single-page app displayed at 390×780px (iPhone proportions).

## Three Core Views
1. **Today** (`TodayView`) — Hero workout card (dark), week mini-strip, "up next" row
2. **Week** (`WeekView`) — Nav between weeks, day-by-day list with expandable details
3. **Plan** (`PlanView`) — Full 18-week list with progress bar and per-week intensity visualization

## Components
All in `index.html` (single-file prototype):

| Component | Description |
|---|---|
| `Badge` | Run type chip (EASY/TEMPO/LONG/RACE/REST/DONE) |
| `Mono` | DM Mono span for data values |
| `Label` | Uppercase overline label |
| `ProgressBar` | Animated fill bar |
| `TodayView` | Today's workout screen |
| `WeekView` | Weekly calendar view |
| `PlanView` | Full plan + progress |
| `Nav` | Bottom tab bar |

## Design Notes
- Dark status bar + logo header; light content area
- Current week/day highlighted in brand orange
- Completed days in green; future days muted
- All data driven from a plan generator (`makeWeek(wk)`) — change `TOTAL_WEEKS`, `CURRENT_WEEK`, `CURRENT_DAY` to update state
- `localStorage` persists selected tab across refresh
