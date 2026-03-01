# Product Requirements Document
# Adaptive Times Tables Trainer — Web App

**Version:** 1.0
**Date:** 2026-03-01
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement

Children learning times tables often waste time drilling facts they already know, while the genuinely difficult ones (6s, 7s, 8s, 9s, 11s, 12s) don't get enough focused repetition. Generic apps treat every fact equally and offer no mechanism to skip what's already mastered. There is no widely-used free tool that adapts to an individual child's starting point and uses AI to make the hardest facts memorable.

### 1.2 Product Vision

A visually engaging, adaptive web app that meets a child exactly where they are. Parents configure what's already known; the app does the rest — drilling the gaps, celebrating progress, and generating clever mnemonics for the facts that just won't stick.

### 1.3 Target Users

| User | Role |
|------|------|
| Child (age 6–12) | Primary learner — interacts with the app daily |
| Parent / Carer | Configures the app, monitors progress |

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Child masters their gap tables | ≥ 80% accuracy on target tables within 4 weeks of regular use |
| Daily engagement | Average session length ≥ 5 minutes |
| Retention | Child returns on ≥ 4 days per week |
| Parent satisfaction | Parent reports visible improvement |

---

## 3. Scope

### 3.1 In Scope (v1)

- Parent onboarding: marking already-mastered tables
- Adaptive drill engine using spaced repetition (simplified SM-2)
- Visual representation of each multiplication fact (dot arrays / area models)
- AI-generated mnemonics for flagged hard facts
- Pearls, streaks, and simple reward mechanics
- Progress summary visible to both child and parent
- Local persistence (localStorage — no account required)

### 3.2 Out of Scope (v1)

- User accounts / cloud sync
- Tables beyond 12
- Multiplayer or classroom modes
- Native mobile apps (responsive web only)
- Printable cheat sheets (v2)
- Parent dashboard with detailed analytics (v2)

---

## 4. User Stories

### Parent Setup

- **US-01** As a parent, I can open the app and mark which times tables my child has already mastered, so the app never wastes her time on those.
- **US-02** As a parent, I can update the mastered list at any time as my child progresses.
- **US-03** As a parent, I can see a simple summary of which tables are mastered, in-progress, and not yet started.

### Child — Core Drill Loop

- **US-04** As a child, I am shown a multiplication question (e.g. "6 × 7 = ?") and I can type or tap my answer.
- **US-05** As a child, I receive immediate visual feedback — a clear green tick for correct, a gentle red shake for wrong, with the right answer revealed.
- **US-06** As a child, the app shows me a dot array or area model alongside every question so I can see what the multiplication means, not just recite it.
- **US-07** As a child, questions I get wrong appear more often until I consistently get them right.
- **US-08** As a child, I can ask for a mnemonic hint on any question and the app shows me a fun rhyme or story to help me remember it.

### Child — Motivation

- **US-09** As a child, I earn pearls for correct answers and see my current streak so I feel rewarded for consistent play.
- **US-10** As a child, I can see my "Ocean Map" — a visual seabed showing each times table as a different sea creature, with mastered ones glowing in full colour and in-progress ones as partial silhouettes.
- **US-11** As a child, completing a full times table unlocks a small celebration animation with bubbles and swimming fish.

---

## 5. Functional Requirements

### 5.1 Parent Onboarding

| ID | Requirement |
|----|-------------|
| F-01 | App launches with a setup screen on first visit asking which tables are already mastered (checkboxes for 1–12). |
| F-02 | Selected tables are excluded from the drill queue permanently until the parent edits them. |
| F-03 | Setup is accessible again via a lock-icon menu (PIN or simple parent gate to prevent accidental changes by the child). |

### 5.2 Spaced Repetition Engine

| ID | Requirement |
|----|-------------|
| F-04 | Each fact (e.g. 6×7) has an individual mastery score and a next-due timestamp based on SM-2 intervals. |
| F-05 | Correct answers push the next-due date further out; wrong answers reset it to "due now". |
| F-06 | The drill queue always surfaces the most overdue / lowest-mastery facts first. |
| F-07 | Facts within already-mastered tables are never added to the queue. |
| F-08 | All state is persisted to localStorage after every answer so progress survives page refreshes. |

### 5.3 Visual Representation

| ID | Requirement |
|----|-------------|
| F-09 | Every question displays a dot array (rows × columns) that animates in when the question loads. |
| F-10 | On answer reveal, the array highlights to show grouping (e.g. 6 rows of 7 dots, colour-coded by row). |
| F-11 | An optional "area model" toggle shows a rectangle split into equal sections as an alternative visual. |
| F-12 | All visuals are large, bold, and high-contrast for a young audience. |

### 5.4 AI Mnemonic Engine

| ID | Requirement |
|----|-------------|
| F-13 | A "Help me remember" button appears after a wrong answer or on demand. |
| F-14 | Tapping it calls the Claude API with the specific fact and returns a short, child-friendly rhyme or story (≤ 2 sentences). |
| F-15 | Generated mnemonics are cached in localStorage so the same fact always shows the same mnemonic. |
| F-16 | The mnemonic is shown in a speech-bubble overlay with a friendly character illustration. |

### 5.5 Gamification

| ID | Requirement |
|----|-------------|
| F-17 | Each correct answer awards 1 pearl; streak bonuses (×2 at 5 in a row, ×3 at 10) award extra pearls. |
| F-18 | A running pearl total and current streak counter are always visible during a session. |
| F-19 | Completing all facts in a table (≥ 80% mastery threshold) triggers a full-screen bubble celebration and marks that sea creature as fully discovered on the Ocean Map. |
| F-20 | Daily login streak is tracked and displayed. |

### 5.6 Ocean Map (Progress Map)

Each times table is represented by a distinct sea creature on a seabed scene (e.g. 1=Starfish, 2=Jellyfish, 3=Crab, 4=Seahorse, 5=Dolphin, 6=Octopus, 7=Shark, 8=Whale, 9=Turtle, 10=Manta Ray, 11=Clownfish, 12=Narwhal).

| ID | Requirement |
|----|-------------|
| F-21 | The home screen shows a seabed scene with 12 sea creatures, each labelled with its table number. |
| F-22 | Mastered tables (pre-configured by parent or completed in-app) are rendered in full vivid colour with a gentle glow and slow idle animation. |
| F-23 | In-progress tables appear as a partial silhouette that fills with colour as mastery increases. |
| F-24 | Not-yet-started target tables are shown as faint outlines, visible but clearly unexplored. |
| F-25 | Tapping a creature starts a drill session focused on that table. |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NF-01 | **Performance:** Questions load and animate within 300 ms on a mid-range mobile browser. |
| NF-02 | **Accessibility:** WCAG 2.1 AA colour contrast; all interactive elements reachable via keyboard. |
| NF-03 | **Child safety:** No ads, no external links, no chat, no user-generated content in v1. |
| NF-04 | **Offline-first:** Core drill loop works without internet (mnemonic generation requires connectivity). |
| NF-05 | **Responsive:** Fully usable on a phone (320px+), tablet, and desktop without a native install. |
| NF-06 | **Privacy:** No personal data leaves the device in v1; localStorage only. |

---

## 7. UX & Visual Design Guidelines

- **Aesthetic:** Underwater ocean theme. Deep teal/navy background with soft bioluminescent glow effects, drifting bubbles, and swaying seaweed. Vibrant but not babyish — aspirational for a 7–10 year old.
- **Typography:** Rounded, friendly sans-serif (e.g. Nunito or Quicksand). Large font sizes throughout (minimum 18px for question text).
- **Colour palette:** Deep ocean teal/navy background, pearl-white reward icons, coral and aqua accents, vivid creature colours per table. Bright green for correct, warm coral-red for wrong — never harsh.
- **Animation:** Dot arrays animate in as rising bubbles (fade up + slight wobble per dot). Correct answer: array pulses green with a ripple effect. Wrong answer: gentle horizontal shake, then correct answer fades in. Seaweed and particles drift subtly in the background at all times.
- **Input:** Large tap targets for digit buttons (on-screen numpad) on mobile; keyboard input on desktop. No tiny text inputs.
- **Mnemonic overlay:** A friendly octopus character appears in the corner holding a scroll and "says" the mnemonic in a speech bubble.

---

## 8. Technical Architecture

### 8.1 Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React (Vite) | Fast dev setup, component model suits the screen-based flow |
| Styling | Tailwind CSS | Utility-first; easy responsive design and consistent spacing |
| Animation | Framer Motion | Smooth dot-array and celebration animations with minimal code |
| State | Zustand + localStorage | Simple global state; no backend needed for v1 |
| AI | Claude API (claude-haiku-4-5) | Fast, cheap, child-safe mnemonic generation |
| Hosting | Vercel / Netlify | Free tier, instant deploy from git |

### 8.2 Key Data Structures

```ts
// Stored in localStorage
interface FactRecord {
  tableN: number;       // e.g. 6
  multiplier: number;   // e.g. 7
  easeFactor: number;   // SM-2 ease factor (default 2.5)
  interval: number;     // days until next review
  dueAt: number;        // Unix timestamp
  mastery: number;      // 0–1 rolling accuracy score
  mnemonic?: string;    // cached AI mnemonic
}

interface AppState {
  masteredTables: number[];   // e.g. [1,2,3,4,5,10]
  facts: FactRecord[];
  stars: number;
  streak: number;
  lastSessionDate: string;    // ISO date
}
```

### 8.3 SM-2 Algorithm (Simplified)

```
On correct answer:
  if interval === 0: interval = 1
  else if interval === 1: interval = 6
  else: interval = round(interval × easeFactor)
  easeFactor = max(1.3, easeFactor + 0.1)

On wrong answer:
  interval = 0
  easeFactor = max(1.3, easeFactor - 0.2)

dueAt = now + interval × 86_400_000
```

### 8.4 Mnemonic API Call

```ts
const prompt = `Generate a single short, fun, child-friendly rhyme or story
(maximum 2 sentences) that helps a 7-10 year old remember that ${a} × ${b} = ${a * b}.
Be creative and memorable. Just the mnemonic, nothing else.`;
```

---

## 9. Screen Inventory

| Screen | Description |
|--------|-------------|
| **Setup / Onboarding** | First-launch only. Parent selects mastered tables. CTA: "Dive in!" |
| **Ocean Map (Home)** | Seabed scene with 12 sea creatures showing mastery state. Pearl/streak counters top-right. Settings icon. |
| **Drill Session** | Question + bubble dot array + answer input + streak bar. Hint button bottom-right. |
| **Answer Reveal** | Correct/wrong feedback, ripple array animation, optional mnemonic overlay with octopus. "Next" button. |
| **Table Complete** | Full-screen bubble celebration when a table hits ≥ 80% mastery; creature fully illuminates on the Ocean Map. Share prompt (v2). |
| **Settings** | Parent-gated. Edit mastered tables, reset progress, toggle area-model view. |

---

## 10. Phased Roadmap

### v1 — MVP (Core loop)
- Parent setup, Ocean Map, drill session, bubble dot-array visuals, basic pearl/streak rewards, localStorage persistence

### v1.1 — AI Mnemonics
- Claude API integration, mnemonic caching, octopus character overlay

### v2 — Parent Dashboard & Polish
- Progress charts per table, printable personalised cheat sheet, tables beyond 12, area-model toggle, daily reminder notification (PWA)

### v3 — Accounts & Multi-child
- Cloud sync, multiple child profiles, optional classroom/teacher view

---

## 11. Open Questions

| # | Question | Owner |
|---|----------|-------|
| 1 | Should the dot array always be visible, or only revealed after answering? (Always visible reinforces conceptual understanding; reveal-after adds a challenge mechanic.) | Design decision |
| 2 | What's the mastery threshold for marking a table "done"? 80% accuracy over last 10 attempts is a reasonable starting point — confirm. | Product |
| 3 | Should the mnemonic feature be gated behind a premium flag in v1, or free for all? | Monetisation |
| 4 | Parent gate mechanism: simple 4-digit PIN set at onboarding, or a "type a word a child wouldn't know" challenge? | UX |
