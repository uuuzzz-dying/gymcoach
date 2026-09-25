# Personal fitness edition

Based on Julien-Au/gymcoach, MIT. This independent personal app is not affiliated with PureGym.

New accounts receive a gentle Monday / Wednesday / Friday beginner Push / Pull / Legs program. No fictional training history or body measurements are inserted. The home screen starts with an orientation visit; classes, walks and recovery days can be logged under `/activities`. Membership cost is user-entered. Visits count unique London calendar dates, so strength and a class on the same day count once. Recovery counts toward habit streaks but not gym visits unless explicitly marked as at the gym.

Glucose is manually recorded in mmol/L, separate from the general readiness note. It is not included in the existing AI coach payload and does not prescribe exercise clearance, medication or automatic load changes. Safety wording links to the NHS low-blood-sugar guidance. General readiness notes retain upstream AI behavior. No AI provider is configured by default.

## Run

Use Node 20+ and PostgreSQL. Copy `.env.example` to `.env`, set a unique JWT_SECRET (32+ characters) and DATABASE_URL, then run:

```
npm ci
npm run db:migrate:deploy
npm run dev
```

Register in the UI to create your own account and plan. Optional `npm run db:seed` requires explicit USER_EMAIL and USER_PASSWORD. It does not overwrite existing plans or add sample sessions.

## Hosting

Vercel requires a separately provisioned PostgreSQL database. Set DATABASE_URL and JWT_SECRET as encrypted environment variables. Apply migrations before directing traffic to a new version. Do not upload `.env`, database data or real health records to GitHub. Keep NEXT_PUBLIC_DEMO_MODE false. AI provider keys remain optional.

Upstream progress-photo uploads use local disk; Vercel's ephemeral filesystem is not suitable for durable photos. Do not use that upstream feature on Vercel until durable private storage is configured. Existing session-set offline logging and rest timer are preserved; the new activity and readiness forms require a connection and report save failures.

The production build generates the service worker. On iPhone, use Safari's Share > Add to Home Screen. Native WidgetKit / Live Activities are deferred until the web app is stable.

## Validation on Windows

Type checking and lint pass (one pre-existing unused-helper warning). Local API smoke checks cover signup, automatic plan, empty history, glucose validation, fee updates, classes, sets, finishing a session, dashboard totals and unauthenticated access. Of the upstream unit suite, 1091 tests pass; three progress-photo tests require POSIX permission/symlink semantics not available in this Windows test environment. These tests have not been weakened or disabled.
