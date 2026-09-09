# Personal Tracker

A calendar-centric tracker for running several concurrent goals on one date grid: job applications, technical interview prep, immigration and admin tasks, and daily habits.

> Status: design phase. See [docs/DESIGN.md](docs/DESIGN.md) for the proposed stack, data model, and build plan.

## Why I built this

I was juggling a job search, interview preparation, immigration paperwork, and a few habits at the same time, and every tool I tried treated those as separate apps. I wanted one calendar where a single day shows everything I did across all of them, with streaks and weekly rollups so I could tell whether I was actually making progress.

It is also a deliberate portfolio piece. I work in QA and test automation and am moving toward platform and developer productivity engineering, so the project is built the way I would want a service at work to be built: typed, tested, linted in CI, containerized, and documented, with a commit history that shows the work in the order it happened.

## Features (MVP)

- Month and week calendar views; click a day to open its detail panel.
- Add, edit, and delete entries per day, each scoped to a category with its own form.
- Four built-in categories: Job Search, DSA / Study, Immigration / Admin, Habits. New categories plug in without a database migration.
- Dashboard with weekly and monthly rollups per category and habit streaks.
- Search and filter by category, date range, and text.
- Local-first persistence in the browser (IndexedDB). Data survives reloads and works offline.

## Getting started

Setup instructions are added with the first application commit.

## Architecture

See [docs/DESIGN.md](docs/DESIGN.md). The short version: a React and TypeScript single-page app, Dexie over IndexedDB behind a small repository layer, one Zod schema per category, and pure functions for streaks and rollups that carry the unit tests.

## Screenshots

Coming with the first UI commits.

## Roadmap

Stretch goals, in rough priority order: export to CSV and JSON, reminders for upcoming due items, trend charts, and a backend for auth and multi-device sync.

## License

MIT
