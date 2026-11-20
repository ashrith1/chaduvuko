# 📱 Chaduvuko Client — Mobile-First Frontend

The frontend for **Chaduvuko (చదువుకో)** — an ultra-responsive, mobile-first single page progressive web application (PWA) built specifically for Class 12 (BIEAP Andhra Pradesh Board) students.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [React 19](https://react.dev/) with TypeScript
- **Bundler & Dev Server:** [Vite](https://vitejs.dev/) with fast Hot Module Replacement (HMR)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with an OLED dark aesthetic (`#09090b`)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Micro-interactions & Celebrations:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **PWA Capabilities:** Standalone display mode, Service Worker cache (`public/sw.js`), Web App Manifest (`public/manifest.json`), Apple Touch & Maskable high-res app icons

---

## 📂 Component Directory Breakdown

```text
client/src/
├── App.tsx                     # Main application layout, state orchestrator, tab router & polling
├── main.tsx                    # Application entry point with Service Worker registration
├── types.ts                    # Shared TypeScript interfaces (User, Target, Chapter, Syllabus, etc.)
├── index.css                   # Global Tailwind CSS imports & animations
├── App.css                     # Component micro-animations and custom scrollbar styles
├── services/
│   └── api.ts                  # Typed Axios/Fetch client wrapper for all backend REST endpoints
└── components/
    ├── Header.tsx              # Top navigation bar, user switcher drawer, date picker & PWA install banner
    ├── DailyTargets.tsx        # Daily to-do list, subject filters, completion checklists, and quick task cards
    ├── TargetModal.tsx         # Task creation modal with Exercise-picker (Maths) and Blueprint types (Physics/Chem)
    ├── CompleteTaskModal.tsx   # Dialog on completing a task: "All Questions" or "Custom count (e.g. 8)"
    ├── GroupHub.tsx            # Peer accountability hub, dual progress analytics, live streaks & study minutes
    ├── SyllabusView.tsx        # Comprehensive BIEAP chapter weightage explorer, unit groupings & progress toggles
    ├── SyllabusEditorModal.tsx # In-app JSON editor to customize chapter marks or reset to official defaults
    ├── StudyTimer.tsx          # Pomodoro timer (15m, 25m, 45m, 60m) & Stopwatch linked to specific targets
    ├── UserModal.tsx           # Modal for creating a new student profile in the study group
    ├── ManageUsersModal.tsx    # Management dialog to edit student profiles, avatars, and app branding
    └── AboutModal.tsx          # Detailed in-app guide explaining Chaduvuko, BIEAP weightages & exam strategies
```

---

## 💡 Key Design Patterns

1. **Dual Progress Intelligence:**
   - Evaluates both today's tactical tasks (`completedToday / totalToday`) and strategic board syllabus completion based on chapter marks weightage (`completedMarks / grandTotalMarks`).
2. **Exercise-Level Precision for Maths:**
   - In BIEAP 2nd Year Mathematics, question allocation corresponds directly to NCERT/Telugu Akademi exercises. The client enables picking exact exercises (e.g., `Exercise 7(b)`) instead of generic mark counters.
3. **Optimistic Updates & Auto-Sync:**
   - State updates immediately on touch for zero latency, accompanied by haptic feedback (where supported via `navigator.vibrate`) and confetti celebrations on task completion.
   - Background polling continuously refreshes peer activity and group progress every 10 seconds.
4. **Offline & Android Add to Home Screen:**
   - Fully optimized for mobile viewport constraints, safe-area insets, and bottom thumb-navigation dock.

---

## 🚀 Development Scripts

Inside the `client/` directory:

```bash
# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:3000)
npm run dev

# Run TypeScript type check and compile production build
npm run build

# Preview production build locally
npm run preview

# Lint code with Oxlint
npm run lint
```
