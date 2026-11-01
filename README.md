# 🎊 GenAI-Powered Celebration & Event Planning Assistant

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-22C55E?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AA-success)](#accessibility)

> **UtsavAI** is an intelligent, context-aware GenAI planning assistant designed to organize **Weddings**, **Milestone Birthdays**, and **Community Cultural Festivals**. It combines dynamic budget optimization, countdown milestone roadmaps, vendor quote tracking & rating pipelines, AI-generated concept idea boards, and multilingual cultural invitation card studios.

---

## 📌 Table of Contents

1. [Chosen Challenge Vertical & Persona](#1-chosen-challenge-vertical--persona)
2. [Approach and Architectural Logic](#2-approach-and-architectural-logic)
3. [How the Solution Works](#3-how-the-solution-works)
   - [💰 Smart Budget & Expense Manager](#-smart-budget--expense-manager)
   - [📋 Milestone Countdown & Task Checklists](#-milestone-countdown--task-checklists)
   - [🏪 Vendor Negotiation & Rating Pipeline](#-vendor-negotiation--rating-pipeline)
   - [💡 GenAI Concept & Inspiration Studio](#-genai-concept--inspiration-studio)
   - [🤖 Interactive Planning Copilot](#-interactive-planning-copilot)
   - [🎨 Multilingual AI Card Studio](#-multilingual-ai-card-studio)
4. [Assumptions Made](#4-assumptions-made)
5. [Code Quality, Security & Efficiency](#5-code-quality-security--efficiency)
6. [Accessibility (a11y)](#6-accessibility-a11y)
7. [Validation & Testing](#7-validation--testing)
8. [Getting Started & Local Setup](#8-getting-started--local-setup)

---

## 1. Chosen Challenge Vertical & Persona

### Vertical Focus: Celebration & Milestones Planning (Weddings, Birthdays & Community Festivals)

Event planning across life milestones is notoriously fragmented. Organizers must balance rigid financial constraints, dynamic countdowns, unpredictable vendor pipelines, and aesthetic inspirations across diverse cultural traditions.

Our solution is built around three core archetypes:

| Event Persona | Target Scope | Core Problem Addressed | AI-Driven Value Add |
| :--- | :--- | :--- | :--- |
| **Royal & Modern Weddings** | 100 - 800+ guests | Multi-day ceremony logistics (Mehendi, Sangeet, Pheras), high budget stakes, intricate caterer/photographer contracts. | Budget allocation ratios, vendor payment milestones, cultural verse copywriting in 5 languages. |
| **Milestone Birthdays** | 20 - 150 guests | Theme coordination, entertainment booking, obstacle courses/cakes, dietary management on tight timelines. | Creative theme brainstorming, age-appropriate game curation, return gift optimization. |
| **Community & Cultural Galas** | 200 - 1000+ attendees | Civic permits, volunteer coordination, staging/AV, public safety, and zero-waste community feasts. | Municipal milestone roadmaps, volunteer role delegation templates, crowd-engagement activities. |

---

## 2. Approach and Architectural Logic

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interaction Tier                           │
│  [Event Dashboard]  [Budget Manager]  [Timeline Roadmap]  [Vendors]    │
│  [AI Ideas Studio]  [AI Card Studio]  [Interactive Planning Copilot]   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Decision & Context Engine                        │
│   • Event Category Context (Marriage, Birthday, Community, Diwali...)  │
│   • Headcount & Financial Ratio Gauges                                 │
│   • Timeline Offsets (-180d, -60d, -30d, Day 0)                        │
│   • Vendor Status State Machine (Contacted → Quoted → Booked → Paid)   │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
┌───────────────────▼──────────────┐   ┌─────────────▼───────────────────┐
│       Google Gemini GenAI        │   │     Smart Cultural Fallback     │
│   (Model: gemini-1.5-flash)      │   │    Deterministic Knowledge Base │
│  • Budget Strategy & Allocation  │   │   • Instant zero-friction tests │
│  • Countdown Milestone Planner   │   │   • Culturally authentic verses │
│  • Vendor Negotiation Directives │   │   • Regional benchmark metrics  │
│  • Personalized Creative Ideas   │   │   • No API key required to test │
└──────────────────────────────────┘   └─────────────────────────────────┘
```

### Contextual Decision Logic
1. **Dynamic Prompt Synthesis**: Every AI prompt injects rich context — event category, date, venue, host name, guest count, and current expenditure levels.
2. **Dual-Path Architecture (Gemini 1.5 Flash + Cultural Fallback Engine)**: If an API key is provided, the app queries Google Gemini with structured JSON output configurations (`responseMimeType: 'application/json'`). If no key is set or network fails, the **Smart Cultural Engine** gracefully falls back to deterministic, culturally vetted databases for zero friction during evaluations.
3. **Local State Reactivity**: All edits, expenses, milestones, and vendors persist client-side in browser `localStorage`, ensuring data durability across refreshes.

---

## 3. How the Solution Works

### 💰 Smart Budget & Expense Manager
- **Total Budget & Guest Headcount Tracking**: Dynamically computes Total Committed, Settled (Paid), Pending (Unpaid), Remaining Budget Pool, and Cost-Per-Guest.
- **Visual Consumption Gauge**: Real-time progress bar with color-coded alerts (green → amber → red) preventing budget blowouts.
- **Expense Logging**: Add itemized expenses with title, amount, category, date, payment status, and invoice notes.
- **Spending by Category Breakdown**: Visual percentage bars highlighting allocation to Venue, Catering, Decor, Photography, Entertainment, etc.
- **AI Budget Advisor**: One-click analysis analyzing budget feasibility, benchmark percentage ratios, saving tips, and hidden cost alerts.
- **Clipboard Export**: Copy complete formatted financial summaries for family or committee reviews.

### 📋 Milestone Countdown & Task Checklists
- **Category-Aware Milestone Generation**: Automatically calculates milestone dates backwards from event date (e.g. Venue booked at T-180 days; Food tasting at T-60 days; Menu lock at T-14 days; Emergency kit at T-2 days).
- **Dual Visual Modes**:
  - *Task Checklist Mode*: Filter by status (Pending, Completed, Overdue) and priority (High, Medium, Low) with search.
  - *Visual Roadmap Mode*: Vertical chronological roadmap visualizing the entire countdown journey.
- **Overdue Detection**: Automatically flags pending tasks whose target due date has passed.
- **AI Planning Copilot**: Recommends strategic countdown directives and allows one-click adoption of AI tasks into the active checklist.

### 🏪 Vendor Negotiation & Rating Pipeline
- **Predefined & Custom Vendor Categories**: Tailored to event types (Weddings: Venue, Caterer, Florist, Mehndi, DJ, Priest; Birthdays: Cake Baker, Magician, Balloons; Community: Sound/Lights, Permits, Security, Food Stalls).
- **Status State Machine**: Seamlessly track vendors through `Not Booked` ➔ `Contacted` ➔ `Quoted` ➔ `Booked` ➔ `Paid`.
- **Financial Audit**: Compares total quoted prices versus final contracted amounts.
- **Interactive Rating & Notes**: 5-star rating system with contact fields (phone, email, notes).
- **AI Vendor Advisor**: Provides custom negotiation strategies, quality indicators, and missing vendor warnings.

### 💡 GenAI Concept & Inspiration Studio
- **8 Domain Streams**:
  1. Theme & Decor Concepts
  2. Culinary & Beverage Curation
  3. Entertainment & Activities
  4. Favors & Keepsake Gifts
  5. Dress Code & Styling Guide
  6. Music & Atmosphere Playlist
  7. Photo Moments & Instagram Backdrops
  8. Unique Cultural & Personal Touches
- **Pin & Favorite Board**: Pin favorite suggestions to a persistent tray.
- **One-Click Export**: Copy single ideas or the entire pinned inspiration board.

### 🤖 Interactive Planning Copilot
- Context-aware modal chatbot capable of answering questions across all planning aspects.
- Pre-populated prompt starters tailored to Weddings, Birthdays, and Community events.
- Structured replies with actionable bullet points.

### 🎨 Multilingual AI Card Studio
- Compose bespoke invitation cards in **5 Languages**: English, Hindi (हिंदी), Marathi (मराठी), Gujarati (ગુજરાતી), and Spanish (Español).
- 6 vibrant event-appropriate visual themes (Sunset Wedding, Birthday Confetti, Royal Gold, Emerald Royale, Diwali Sparkle, Pastel Dream).
- High-resolution client-side export to PNG via `html2canvas`.

---

## 4. Assumptions Made

1. **Client-Side Storage**: In line with privacy-first and evaluation requirements, all data is safely isolated in the evaluator's browser `localStorage` without requiring third-party database credentials.
2. **Deterministic Fallbacks**: To ensure zero friction, an active Gemini API key is *optional*. If left unconfigured, the application functions fully using the built-in Smart Cultural Engine.
3. **Currency Agnostic**: Supports ₹ (INR), $ (USD), € (EUR), £ (GBP), and AED with dynamic formatting.
4. **Target Devices**: Responsive design targeted at modern desktop browsers, tablets, and smartphones.

---

## 5. Code Quality, Security & Efficiency

- **Modern React 19 Architecture**: Modular component hierarchy with functional components, custom hooks, and zero prop drilling.
- **Tailwind CSS v4**: Utility-first styling with zero runtime CSS-in-JS overhead.
- **Oxlint Clean**: Verified against high-speed linting rules with 0 errors.
- **Security Protocols**:
  - API keys are stored only in local browser memory and injected solely in direct requests to Google's official Gemini endpoint (`https://generativelanguage.googleapis.com/v1beta/`).
  - No API keys or personal event details are transmitted to external telemetry servers.
  - XSS-safe text rendering with React JSX escaping.
- **Performance**:
  - Vite production build finishes in **< 3 seconds**.
  - Lightweight bundle size with optimized SVG assets.

---

## 6. Accessibility (a11y)

The application incorporates WCAG 2.1 AA accessibility guidelines:
- **ARIA Landmark & Dialogs**: All modals utilize `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- **Progress Indicators**: Gauges feature `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Keyboard Navigation**: Clean tab order with focus visible rings and escape key dismissals.
- **Contrast & Hierarchy**: Dark slate backgrounds (`#020617` / `#090d16`) paired with high-contrast text (`slate-100`, `amber-300`, `emerald-300`).
- **Reduced Motion**: Respects `prefers-reduced-motion` settings on animated cards.

---

## 7. Validation & Testing

The solution includes an automated Vitest test suite (`src/tests/eventPlanner.test.js`) verifying all critical logic:

```bash
npm test
```

### Test Suite Coverage:
- ✅ **Verticals Verification**: Validates Marriage, Birthday, and Community category representations and initial sample datasets.
- ✅ **Storage Service**: Tests localStorage initialization, updates, and secure API key handling.
- ✅ **Multilingual AI Fallback**: Asserts English, Hindi, and regional copy generation.
- ✅ **Financial Calculation Engine**: Tests expense summing, paid vs. pending splits, percent ratios, and per-guest metrics.
- ✅ **Timeline Milestone Logic**: Validates negative day offset calculations and overdue task detection.

---

## 8. Getting Started & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/event-planner.git
cd event-planner

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Tests & Linting

```bash
# Run automated Vitest suite
npm test

# Run Oxlint
npm run lint

# Build production bundle
npm run build
```

### Configuring Google Gemini API (Optional)
Click **AI Settings** in the top navigation bar to paste your Google Gemini API key. If left blank, the app runs in full offline **Smart Cultural Mode** with zero restrictions.

---

*Curated with ❤️ for memorable Weddings, joyful Birthdays, and vibrant Community Celebrations.*
