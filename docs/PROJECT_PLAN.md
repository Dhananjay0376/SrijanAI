# SrijanAI Project Plan

## Project Status
- Last updated: 2026-04-11
- Current phase: Foundation
- Current focus: Web-first monorepo and landing page scaffold
- Progress summary: Project documentation, monorepo root, and initial Next.js web scaffold are in place. Production build verification is passing.

## Product Vision
SrijanAI is an AI-powered content planning and generation platform for creators and small brands who lose time every month planning posts, writing captions, adapting content for platforms, and maintaining consistency.

The product will begin as a production-grade web application and later expand into an Android app powered by the same backend services, AI orchestration, scheduling logic, and user data.

## Core Problem
Creators spend significant time each month on:
- choosing what to post
- distributing posts across a month
- writing platform-specific captions
- generating hooks and CTAs
- building hashtags
- deciding video execution ideas
- staying consistent without burnout

## Core Value Proposition
SrijanAI should help a creator go from intent to ready-to-publish monthly content faster and with higher consistency.

Target outcomes:
- generate a monthly content calendar in under 60 seconds
- reduce planning workload from hours to minutes
- maintain platform-aware, niche-aware, tone-aware content quality
- support repeatable workflows instead of one-off generation

## Target Users
Primary users:
- solo creators
- coaches
- educators
- freelancers
- personal brands
- small businesses

Secondary users:
- social media managers
- micro agencies
- creator teams

## Product Scope
### Phase 1: Web MVP
- marketing website
- authentication
- creator onboarding
- monthly content calendar generation
- per-post detailed generation
- PDF exports
- save, edit, regenerate, and copy actions

### Phase 2: Workflow and Scheduling
- approval states
- calendar management
- posting reminders
- schedule management
- publishing adapters for supported platforms

### Phase 3: Android App
- Android companion app
- notifications
- daily content reminders
- background generation triggers
- mobile content review and export

## Functional Requirements
### 1. User Input and Onboarding
Users should be able to enter:
- niche
- target platform
- language
- tone
- posting goals
- number of posts to generate in a month

Future onboarding additions:
- target audience
- brand voice rules
- banned words
- CTA preferences
- content pillars
- preferred posting days and times

### 2. Calendar Day Selection
Users should be able to:
- choose exact days manually
- select quick presets such as `Mon/Wed/Fri`
- select quick presets such as `Tue/Thu/Sat`
- choose odd dates
- choose even dates
- see the calendar update interactively based on chosen days

### 3. Monthly Calendar Generation
When the user confirms selected dates:
- the system generates monthly post titles for selected dates
- generated dates are visually marked
- each date supports actions such as `Gen`, approval, and rejection controls

### 4. Per-Post Deep Generation
For a selected post, the system should generate:
- hook
- caption
- hashtags
- CTA
- platform tips
- optional visual or video creation guidance

Actions for each post:
- copy whole post
- copy caption only
- regenerate
- download as PDF

### 5. Video Tips Generator
For each generated post, the system should optionally generate:
- talking-head video suggestion
- shot list
- visual sequence idea
- B-roll suggestions
- edit structure
- first 3 seconds hook suggestion

### 6. PDF Export
Users should be able to:
- download a full monthly content calendar as a styled PDF
- download individual posts as styled PDFs branded by SrijanAI

### 7. Social Publishing System
The system should support:
- generation-first workflow
- future scheduling workflow
- API-based posting where officially supported
- reminder-based manual posting where full automation is not supported

Initial publishing model:
- supported-platform adapters
- approval before publish
- scheduling queue
- retry and failure logging

### 8. Notifications
The Android app should later support:
- reminder one day before scheduled generation
- next-day generation notification
- content-ready notification
- reminders for manual review or publishing

## AI System Design
### Provider Routing
Planned provider fallback order:
1. Groq
2. Gemini
3. OpenRouter

### AI Responsibilities
- monthly title generation
- single post deep generation
- platform adaptation
- video guidance generation
- regeneration with variation
- prompt templates with structured outputs

### AI Reliability Requirements
- timeout handling
- fallback provider routing
- usage tracking
- retry strategy
- structured response validation
- prompt versioning
- output moderation and quality checks

## Product Enhancements To Include
These are recommended additions that materially improve the product:

### Brand Memory
Persistent creator profile storing:
- audience
- brand tone
- vocabulary preferences
- banned phrases
- CTA style
- language rules

### Content Pillars
Monthly content should distribute across predefined pillars such as:
- educational
- authority-building
- personal story
- engagement
- promotional

### Repurposing Engine
Turn one idea into multiple platform variants:
- Instagram caption
- LinkedIn post
- X thread
- carousel outline
- short video script

### Workflow States
Each post should eventually support:
- planned
- generated
- reviewed
- approved
- scheduled
- posted

### Feedback Loop
Later the system should learn from:
- best-performing posts
- poor-performing posts
- user preferences
- regeneration patterns

## Non-Functional Requirements
The product should be:
- production-ready
- scalable
- secure
- fast
- mobile-friendly
- observable
- maintainable

Operational requirements:
- robust error handling
- analytics and event tracking
- audit logs for key actions
- job queue support for long-running generation
- resumable workflows
- strong git discipline

## Recommended Technical Architecture
## Monorepo Structure
```text
apps/
  web/
  mobile/
packages/
  ui/
  ai/
  db/
  config/
  types/
  utils/
docs/
  PROJECT_PLAN.md
```

### Recommended Stack
Web:
- Next.js
- TypeScript
- Tailwind CSS
- component system in shared package

Backend:
- Next.js server routes or dedicated API service
- PostgreSQL
- Prisma or Drizzle
- queue system for background jobs

Auth:
- production-grade auth provider

Payments:
- Stripe in a later phase

Mobile:
- Android app after web foundation is stable

Infra and Ops:
- Vercel for web deployment
- managed database
- monitoring and logging

## Main Data Models
Initial likely models:
- User
- CreatorProfile
- Workspace
- ContentCalendar
- CalendarDay
- Post
- PostVersion
- ExportJob
- GenerationJob
- ProviderLog
- NotificationRule
- SocialConnection

## Security and Compliance
Must include:
- secure auth flows
- protected API routes
- server-side secret management
- rate limiting
- input validation
- audit-friendly logs

Public website must include:
- Privacy Policy
- Terms and Conditions

## Website Requirements
### Pages
- Home
- About
- Guide
- Auth pages
- App dashboard
- Privacy Policy
- Terms and Conditions

### Homepage Goals
- introduce the value clearly
- feel premium and modern
- show product workflow
- showcase monthly calendar UI
- explain AI generation process
- build trust
- drive sign-ups

### Homepage Visual Direction
- strong hero section
- 3D-inspired visuals or motion-led presentation
- multiple conversion-oriented sections
- responsive design
- polished footer with legal links

## Build Roadmap
### Milestone 0: Planning and Repo Setup
- define project plan
- decide architecture
- initialize monorepo
- establish git workflow

### Milestone 1: Marketing Site and Auth
- landing page
- navigation
- footer
- auth flow
- about page
- guide page
- legal pages

### Milestone 2: Onboarding and Calendar Selection
- onboarding inputs
- monthly post count
- day presets
- interactive calendar selection

### Milestone 3: AI Generation Core
- provider abstraction
- Groq integration
- fallback logic
- monthly title generation
- per-post detailed generation

### Milestone 4: Content Management
- save/edit/regenerate/copy
- approval state handling
- post detail views
- calendar persistence

### Milestone 5: Export and Sharing
- full monthly PDF export
- single post PDF export

### Milestone 6: Scheduling and Publishing
- scheduling engine
- reminders
- supported social adapters

### Milestone 7: Android App
- mobile app shell
- notifications
- content-ready alerts
- review and export flows

## Git Workflow
To keep the project understandable through timestamps and git history:
- make small, meaningful commits
- use one logical change per commit where possible
- push after each meaningful completed unit
- keep commit messages explicit and searchable
- update this document after completing milestones or meaningful subtasks

Suggested commit style:
- `chore: initialize monorepo`
- `docs: add SrijanAI project plan`
- `feat: scaffold landing page`
- `feat: add auth layout and routes`
- `feat: add homepage hero section`

## Definition of Done For Each Task
Before a task is considered complete:
- implementation is added
- basic verification is performed
- this document is updated where relevant
- git commit is created
- commit is pushed to remote when possible

## Progress Log
### Completed
- 2026-04-11: Initialized living project plan document
- 2026-04-11: Set up web-first monorepo root with workspace configuration
- 2026-04-11: Scaffolded initial Next.js web app in `apps/web`
- 2026-04-11: Added first landing page shell for SrijanAI
- 2026-04-11: Verified production build for the initial web scaffold

### In Progress
- Prepare landing page refinement and authentication foundation

### Next Up
- Refine homepage sections and navigation
- Add authentication foundation
- Add About, Guide, Privacy Policy, and Terms pages

## Open Decisions
These should be finalized as we move into implementation:
- exact auth provider
- exact database ORM
- exact queue/job system
- whether mobile app is React Native or another stack
- payment model and pricing tiers
- which social platforms are included in the first supported publishing release

## Working Rule For This Repository
This repository will be built incrementally with:
- clear task boundaries
- updated project documentation
- granular commits
- regular pushes to GitHub
- progress tracked in this file as features are completed

## Implementation Notes
- Root workspace uses npm workspaces for a web-first monorepo foundation.
- The initial web app is built with Next.js App Router and TypeScript.
- A repo-local `.npmrc` overrides the global npm script shell to use `cmd.exe`, which avoids Windows build issues caused by a Git Bash `script-shell` override.
- Initial dependency installation was slowed by npm registry connection resets and long package metadata fetch times; the current lockfile and installed dependencies are now in a working state.
