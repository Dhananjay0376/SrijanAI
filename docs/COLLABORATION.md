# SrijanAI Collaboration Guide

## Goal
This repository is structured as a single monorepo so frontend, backend, and later mobile work can move in parallel without unnecessary conflicts.

## Repo Ownership Model
- `apps/web`: marketing site, dashboard UI, onboarding flow, calendar experience
- `apps/api`: backend routes, AI orchestration, jobs, provider routing, integrations
- `apps/mobile`: Android app in a later phase
- `packages/ui`: shared UI building blocks
- `packages/types`: shared TypeScript contracts
- `packages/db`: database schema and access layer
- `packages/ai`: provider abstractions, prompts, fallback logic

## Recommended Team Workflow
Each teammate should work on a dedicated branch created from `main`.

Examples:
- `feature/frontend-homepage`
- `feature/frontend-onboarding`
- `feature/backend-ai-routing`
- `feature/backend-db-schema`

## Branch Rules
- branch from latest `main`
- keep changes scoped to one task
- commit small batches
- push frequently
- open a pull request before merging into `main`

## Merge Safety Rules
- do not push direct feature work to `main`
- do not mix backend and frontend refactors in the same pull request unless required
- keep shared package changes explicit and documented
- sync shared contract changes with both frontend and backend owners

## Suggested Ownership Boundaries
Frontend contributors should mostly work in:
- `apps/web`
- `packages/ui`

Backend contributors should mostly work in:
- `apps/api`
- `packages/db`
- `packages/ai`

Cross-team shared work should mostly happen in:
- `packages/types`

## Pull Request Checklist
- code is scoped to one clear task
- local verification completed
- no secrets committed
- docs updated if structure or workflow changed
- reviewer can understand the intent from the title and commit history

## Conflict Reduction Tips
- avoid editing the same shared files unless necessary
- prefer shared types over duplicating request or response shapes
- split large changes into multiple pull requests
- merge frequently to avoid long-lived drift from `main`

## Local Setup Note (Windows)
If `npm run build` fails locally because npm is configured to use Git Bash as the script shell,
set a local user-level override instead of committing `.npmrc`:

```
npm config set script-shell "C:\\Windows\\System32\\cmd.exe"
```

## Current Working Rule
SrijanAI will stay as one monorepo with separated app and package boundaries, not as separate frontend and backend repositories.
