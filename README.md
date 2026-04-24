# NeatIQ

An alcohol awareness quiz app. Originally built as a Sitecore CMS rendering, refactored into a standalone Vue 3 single-page application — no backend, no build step, just static files.

---

## Tech

Vue 3 (Options API), Vue Router 4 (hash mode), Motion.js v11, Font Awesome 6.5, Google Fonts (DM Serif Display + DM Sans). Everything loaded from CDN — no npm, no bundler.

## File structure

```
neatiq/
├── index.html                       # App shell, CDN scripts, header/footer
├── css/
│   ├── base.css                     # Design tokens, themes, shared components
│   └── quiz.css                     # Quiz-specific styles, animations
├── js/
│   ├── data.js                      # Quiz content — questions, results, articles
│   ├── quizStore.js                 # Reactive store (Vue.reactive + provide/inject)
│   └── app.js                       # Root Vue instance, theme toggle
├── src/
│   ├── router/index.js              # 3 routes with guards
│   └── components/
│       ├── QuizLanding.js           # Landing page with Motion.js stagger
│       ├── SettingsPanel.js         # Pre-quiz config modal
│       ├── ScoreHistory.js          # Past attempts popup with bar chart
│       ├── QuizPlay.js              # Question flow orchestrator
│       ├── QuizProgress.js          # Progress bar
│       ├── McqQuestion.js           # Multiple choice
│       ├── DragDropQuestion.js      # Drag-and-drop (desktop + touch)
│       ├── PollQuestion.js          # Post-quiz poll
│       ├── FeedbackPanel.js         # Correct/incorrect slide-up panel
│       ├── QuizResults.js           # Immersive results page
│       └── AnswerReview.js          # Tabbed review carousel + chart
└── robots.txt
```

## Features

**Quiz flow** — 5 or 10 questions (MCQ + drag-and-drop), configurable before start. Featured questions appear first, non-featured shuffled. Post-quiz poll, then results.

**Drag and drop** — HTML5 Drag API on desktop, custom touch event system (`touchstart`/`touchmove`/`touchend`) on mobile with floating clone, auto-scroll, and drop zone highlighting.

**Dual theme** — Emerald Night (dark) and Ivory Sage (light). 40+ CSS custom properties. Header/footer locked to dark emerald in both themes. Theme switch replays all visible animations.

**Results page** — Fixed animated gradient mesh background with glassmorphism cards. Full-circle SVG score meter with animated gold arc, glowing knob, and count-up score. Scroll-triggered animations via IntersectionObserver + Motion.js.

**Answer review** — Two tabs: detailed card carousel (swipe on mobile, dot navigation) and quick summary with animated stat cards + time-per-question bar chart.

**Score history** — Past attempts stored in localStorage (max 20). Shows best/average scores and a bar chart of recent attempts.

**Settings** — Question count, image toggle, instant feedback toggle. Persists to localStorage.

## Responsive

Mobile-first responsive layout across phone, tablet, and desktop. Fluid spacing and typography scale with viewport width.

## Accessibility

Keyboard navigation (Arrow keys, Enter, Space) on MCQ and poll. `aria-label` on interactive sections, `aria-live` on feedback panel, `aria-checked` on toggles, focus-visible outlines, skip-to-content link.

## What changed from Sitecore

Replaced `.cshtml` templates and backend API calls with static `data.js` and localStorage. Removed JWT auth. Consolidated duplicate response-saving methods into one `addResponse()`. Added theming, score history, settings, answer review, and the immersive results page — none of these existed in the original.