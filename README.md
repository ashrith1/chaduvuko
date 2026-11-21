# 🎯 Chaduvuko (చదువుకో) — Class 12 Board Prep & Weightage Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Node_Express-4.21-white?logo=express&logoColor=black)](https://expressjs.com/)
[![Board](https://img.shields.io/badge/Board-BIEAP_Andhra_Pradesh-orange)](https://bie.ap.gov.in/)
[![Platform](https://img.shields.io/badge/Platform-Mobile_First_PWA-success)](https://web.dev/progressive-web-apps/)

> **చదువుకో (Chaduvuko)** is Telugu for *"Go Study!"* — a minimal, high-efficiency, mobile-first study group companion and official weightage tracker engineered specifically for **12th Class / Intermediate 2nd Year students** under the **Board of Intermediate Education, Andhra Pradesh (BIEAP)** preparing for their Intermediate Public Examinations (IPE).

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
  - [The Challenge](#the-challenge)
  - [The Chaduvuko Solution](#the-chaduvuko-solution)
- [Key Features](#-key-features)
- [BIEAP Exam Blueprint & Chapter Weightages](#-bieap-exam-blueprint--chapter-weightages)
  - [1. Mathematics (126 Marks Pool)](#1-mathematics-126-marks-pool)
  - [2. Physics (106 Marks Pool)](#2-physics-106-marks-pool)
  - [3. Chemistry (110 Marks Pool)](#3-chemistry-110-marks-pool)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Repository Directory Structure](#-repository-directory-structure)
- [REST API Reference](#-rest-api-reference)
- [Quick Start & Setup Guide](#-quick-start--setup-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Connecting Android Devices over Local Wi-Fi](#connecting-android-devices-over-local-wi-fi)
  - [Installing as an Android PWA App](#installing-as-an-android-pwa-app)
- [Recommended Student Daily Workflow](#-recommended-student-daily-workflow)
- [License](#-license)

---

## 💡 About The Project

### The Challenge
Class 12 / Intermediate 2nd Year in Andhra Pradesh (BIEAP) is a defining academic year. The Intermediate Public Examination (IPE) tests students on an expansive syllabus across Mathematics, Physics, and Chemistry. 

In conventional preparation, students encounter several critical friction points:
1. **Blind Studying without Weightage Awareness:** Students frequently spend weeks solving low-yield exercises while ignoring high-weightage chapters that make up the bulk of 8-mark essay questions and 4-mark short answers.
2. **Exercise Mismatch:** Standard to-do apps ask students for generic task descriptions ("study math for 2 hours") rather than specific textbook exercises (e.g., `Exercise 7(b)` or `Exercise 4(e)`) that directly map to exam questions.
3. **Isolation & Accountability Loss:** Studying alone often leads to procrastination and broken streaks. Students need visibility into peer progress and group momentum.
4. **Disconnection Between Daily Tasks and Board Readiness:** Completing 5 tasks today doesn't show students how close they are to mastering the full 240+ marks board syllabus.

### The Chaduvuko Solution
**Chaduvuko** closes the gap by marrying daily task execution with the official **BIEAP Chapter Weightage Blueprint**:
- Every chapter is pre-configured with official board marks weightages and question types.
- Mathematics tasks are assigned at the **exact exercise level** (from Exercise 1(a) up to 13(d) and chapter MCQs).
- Physics and Chemistry tasks target specific **blueprint question categories** (1M VSAQ, 2M SAQ, 4M LAQ, and 8M Essay problems).
- A **Dual Progress Engine** measures both today's immediate completion percentage and long-term syllabus marks mastery.
- A **Shared Peer Hub** provides live streaks, study minutes, and real-time activity updates for your study circle.
- An **Integrated Focus Timer** automatically credits study minutes toward active targets and student statistics.

---

## 🌟 Key Features

### 1. 📐 Mathematics: Exercise-Based Task Creator
- **Zero Ambiguity:** For Mathematics, tasks are tied to official textbook exercises rather than vague question counts:
  - *Integrals:* Exercise 7(a) through 7(j), Chapter 7 MCQs
  - *Determinants:* Exercise 4(a) through 4(f), Chapter 4 MCQs
  - *Continuity & Differentiability:* Exercise 5(a) through 5(h), Chapter 5 MCQs
  - *Vector Algebra:* Exercise 10(a) through 10(e), Chapter 10 MCQs
  - *And all other 13 Mathematics chapters!*
- For **Physics** and **Chemistry**, you select the **Question Types (1M, 2M, 4M, 8M)** matching their exam blueprint.

### 2. ✅ "End Task" Dialog with Completed Questions Logging
- When creating a task, you **do not need to pick the question count upfront**.
- When you finish studying and tap **"End Task"** (or toggle the completion checkbox), an interactive dialog lets you choose:
  - **"All Questions"** — completed the entire exercise or assignment in one tap.
  - **"Custom Number"** — log the exact count solved (e.g. 5, 8, or 12 questions).
- Task cards clearly display logged outcomes: `✓ Completed: All Questions` or `✓ Completed: 8 Questions`.

### 3. 👥 Group Study Circle & Instant Broadcast
- **Study Together:** Switch between peer profiles or view the group's collective momentum.
- **Broadcast Task to ALL Members:** Enable *"Create Task for ALL Members"* when adding a task to assign a chapter exercise or problem set to your entire study circle simultaneously.
- **Peer Activity & Streaks:** Track each member's active streak (🔥), today's study minutes, and what they are currently solving.

### 4. 📊 Dual Progress Analytics
- **Group Daily Bar:** Collective daily completion percentage + average syllabus marks completion.
- **Personal Progress Bar:** Daily to-do completion percentage + personal overall BIEAP marks mastery percentage.
- **Weightage Weighting:** Marks are earned as chapters move from *Not Started* &rarr; *In Progress* (40% weightage) &rarr; *Completed / Revised* (100% weightage).

### 5. ⏱️ Integrated Pomodoro Focus Timer & Stopwatch
- **Built-in Presets:** Quick-select 15m, 25m (Pomodoro), 45m, 60m focus blocks, or an open Stopwatch.
- **Target Linking:** Link the timer session directly to any of today's targets.
- **Automatic Logging:** When the timer concludes or stops, accumulated study time is logged directly to that target and added to the student's daily study record.

### 6. 📱 Mobile-First Android PWA Experience
- Built from the ground up for phone screens with thumb-friendly navigation, tactile haptic feedback (where supported), and dark OLED aesthetics.
- Includes a service worker, web app manifest, maskable icons, and a standalone display mode.

### 7. ⚙️ In-App Customization & Blueprint Viewer
- **Syllabus Editor:** Edit chapter weightages, add custom topics, or reset to official BIEAP defaults at any time.
- **Member Management:** Add peers, customize avatars, or rename the study circle and board badge.
- **In-App About Modal:** Click the `(i)` button in the header or user drawer anytime to review the BIEAP weightage breakdown and exam tips.

### 8. 🔐 Individual User Accounts & PIN Security
- **Account Isolation:** Each student has their own account and profile.
- **Quick-PIN Verification:** Switch users securely with a 4-to-6 digit PIN pad. Default PIN is `1234` and can be customized at any time.
- **Admin vs. Student Roles:** Ashrith is assigned the `Admin` role with supervisory privileges. Students have focused access without destructive administrative powers.

### 9. 🛡️ Supervisor / Admin Monitoring Dashboard
- **All-Member Audit:** Admin has dedicated access to the **Admin** tab to view all enrolled students at a glance.
- **Performance Surveillance:** Monitor real-time daily completion rates, syllabus coverage %, total study minutes, active streaks, and recent targets for each peer.
- **Remote Goal Assignment:** Assign specific chapter exercises or tasks directly to any student.
- **Security & Account Control:** Reset student PINs or manage membership directly from the supervisor control panel.

### 10. 📅 Interactive Study Calendar & Activity Heatmaps
- **Historical Tracking:** Access the **Calendar** tab to view your entire study journey across weeks and months.
- **Day-by-Day Activity Indicators:** Dates highlight study consistency with green indicators for completed days and amber badges for days with pending tasks.
- **Day Inspector:** Tap any past or upcoming day to view the exact subjects studied, exercises completed, and time logged.
- **Carry-Over Unfinished Tasks:** One-tap action to push missed goals to today with date rescheduling.

### 11. 📲 WhatsApp Daily Study Report Generator
- **One-Click Share:** Tap the Share icon (`Share2`) in the top navigation bar to generate an instant daily progress summary.
- **Formatted for Parents & Mentors:** Beautifully formatted text with completed exercises, questions solved, total focus hours, and current streak.
- **Direct WhatsApp Dispatch:** Send directly via WhatsApp Web / App or copy to clipboard in one tap.

### 12. ☁️ Cloud Persistence with Turso (LibSQL)
- **Zero Data Loss:** All targets, syllabus progress, study sessions, and users are stored in a distributed Turso Cloud database (`libsql://chaduvuko-ashrith1.aws-ap-south-1.turso.io`).
- **Resilient Fallback:** Automatically falls back to local storage if offline or during network outages.

---

## 📐 BIEAP Exam Blueprint & Chapter Weightages

Chaduvuko is pre-loaded with the official 2nd Year Intermediate (Class 12) syllabus and question blueprints:

### 1. Mathematics (126 Marks Pool)

| Chapter | Unit | Weightage | Blueprint Breakdown | Exercises Covered |
| :--- | :--- | :---: | :---: | :--- |
| **Relations and Functions** | Relations & Functions | **7 M** | 1M(1), 2M(1), 4M(1) | Ex 1(a), 1(b), 1(c), MCQs |
| **Inverse Trigonometric Functions** | Relations & Functions | **5 M** | 1M(1), 4M(1) | Ex 2(a), 2(b), 2(c), MCQs |
| **Matrices** | Algebra | **7 M** | 1M(1), 2M(1), 4M(1) | Ex 3(a), 3(b), 3(c), 3(d), MCQs |
| **Determinants** | Algebra | **15 M** | 1M(1), 2M(1), 4M(1), 8M(1) | Ex 4(a) - 4(f), MCQs |
| **Continuity and Differentiability** | Calculus | **7 M** | 1M(1), 2M(1), 4M(1) | Ex 5(a) - 5(h), MCQs |
| **Application of Derivatives** | Calculus | **11 M** | 1M(1), 2M(1), 8M(1) | Ex 6(a) - 6(d), MCQs |
| **Integrals** | Calculus | **23 M** | 1M(1), 2M(1), 4M(1), 8M(2) | Ex 7(a) - 7(j), MCQs |
| **Application of Integrals** | Calculus | **5 M** | 1M(1), 4M(1) | Ex 8(a), 8(b), MCQs |
| **Differential Equations** | Calculus | **11 M** | 1M(1), 2M(1), 8M(1) | Ex 9(a) - 9(f), MCQs |
| **Vector Algebra** | Vectors & 3D | **15 M** | 1M(1), 2M(1), 4M(1), 8M(1) | Ex 10(a) - 10(e), MCQs |
| **Three Dimensional Geometry** | Vectors & 3D | **10 M** | 2M(1), 8M(1) | Ex 11(a), 11(b), MCQs |
| **Linear Programming** | Linear Programming | **5 M** | 1M(1), 4M(1) | Ex 12(a), MCQs |
| **Probability** | Probability | **15 M** | 1M(1), 2M(1), 4M(1), 8M(1) | Ex 13(a) - 13(c), MCQs |

*Total Mathematics Pool Weightage: **126 Marks** (Students choose required questions to score 75/75).*

---

### 2. Physics (106 Marks Pool)

| Chapter | Unit | Weightage | Question Types | Key Focus Areas |
| :--- | :--- | :---: | :---: | :--- |
| **Electric Charges and Fields** | Electrostatics | **7 M** | 1M, 2M, 4M | Gauss's Law & Dipole Fields |
| **Electrostatic Potential & Capacitance** | Electrostatics | **10 M** | 2M, 4M | Capacitors in Series/Parallel |
| **Current Electricity** | Current Electricity | **7 M** | 1M, 2M, 4M | Kirchhoff's Laws & Wheatstone Bridge |
| **Moving Charges and Magnetism** | Magnetic Effects | **10 M** | 2M, 8M | Cyclotron, Biot-Savart, Ampere's Law |
| **Magnetism and Matter** | Magnetic Effects | **7 M** | 1M, 2M, 4M | Magnetic Properties & Dipoles |
| **Electromagnetic Induction** | EMI & AC | **7 M** | 1M, 2M, 4M | Faraday's Law, Lenz's Law & Inductance |
| **Alternating Currents** | EMI & AC | **7 M** | 1M, 2M, 4M | LCR Series Circuit & Transformers |
| **Electromagnetic Waves** | EM Waves | **3 M** | 1M, 2M | EM Spectrum & Applications |
| **Ray Optics and Optical Instruments** | Optics | **10 M** | 2M, 8M | Prism Formula & Lens Maker Equation |
| **Wave Optics** | Optics | **7 M** | 1M, 2M, 4M | Young's Double Slit & Diffraction |
| **Dual Nature of Radiation & Matter** | Modern Physics | **10 M** | 2M, 4M | Photoelectric Effect & de Broglie |
| **Atoms** | Modern Physics | **7 M** | 1M, 2M, 4M | Bohr's Model & Hydrogen Spectrum |
| **Nuclei** | Modern Physics | **10 M** | 2M, 8M | Binding Energy Curve & Nuclear Fission |
| **Semiconductor Devices** | Electronic Devices | **7 M** | 1M, 2M, 4M | p-n Junction & Rectifiers |

*Total Physics Pool Weightage: **106 Marks** (Students choose required questions to score 60/60).*

---

### 3. Chemistry (110 Marks Pool)

| Chapter | Unit | Weightage | Question Types | Key Focus Areas |
| :--- | :--- | :---: | :---: | :--- |
| **Solutions** | Physical Chemistry | **9 M** | 1M, 2M, 4M | Raoult's Law & Colligative Properties |
| **Electrochemistry** | Physical Chemistry | **13 M** | 1M, 2M, 4M | Nernst Equation & Kohlrausch's Law |
| **Chemical Kinetics** | Physical Chemistry | **15 M** | 1M, 2M, 4M, 8M | Rate Laws, Half-Life & Arrhenius Eq |
| **d- and f-Block Elements** | Inorganic Chemistry | **8 M** | 2M, 4M | Transition Elements & Lanthanides |
| **Coordination Compounds** | Inorganic Chemistry | **15 M** | 1M, 2M, 4M, 8M | Werner's Theory, CFT & VBT |
| **Haloalkanes and Haloarenes** | Organic Chemistry | **7 M** | 1M, 2M, 4M | $S_N1$ / $S_N2$ Mechanisms |
| **Alcohols, Phenols and Ethers** | Organic Chemistry | **11 M** | 1M, 2M, 4M | Kolbe's, Reimer-Tiemann & Williamson |
| **Aldehydes, Ketones & Carboxylic Acids** | Organic Chemistry | **15 M** | 1M, 2M, 4M, 8M | Aldol, Cannizzaro & Esterification |
| **Amines** | Organic Chemistry | **7 M** | 1M, 2M, 4M | Hoffmann Bromamide & Diazotization |
| **Biomolecules** | Organic Chemistry | **9 M** | 1M, 2M, 4M | Carbohydrates, Proteins & DNA/RNA |

*Total Chemistry Pool Weightage: **110 Marks** (Students choose required questions to score 60/60).*

---

## 🏗️ System Architecture & Tech Stack

```text
+-------------------------------------------------------------------------+
|                         CHADUVUKO SYSTEM ARCHITECTURE                    |
+-------------------------------------------------------------------------+
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |                  CLIENT (React 19 + Vite + PWA)                 |   |
|   |  - Mobile Viewport Navigation & Haptic Feedback                 |   |
|   |  - DailyTargets | GroupHub | SyllabusView | StudyTimer          |   |
|   |  - CompleteTaskModal (All vs Custom Questions)                  |   |
|   |  - AboutModal (Detailed BIEAP Blueprints & Tips)                |   |
|   +---------------------------------+-------------------------------+   |
|                                     | HTTP REST API (Fetch / Polling)   |
|                                     v                                   |
|   +-----------------------------------------------------------------+   |
|   |                     SERVER (Node.js + Express)                  |   |
|   |  - RESTful API Endpoints (/api/targets, /api/users, etc.)       |   |
|   |  - Dual Progress Engine & Weightage Aggregator                  |   |
|   |  - Task Broadcast Engine                                        |   |
|   |  - Static Client Dist Fallback Host                             |   |
|   +---------------------------------+-------------------------------+   |
|                                     | JSON Persistence                  |
|                                     v                                   |
|   +-----------------------------------------------------------------+   |
|   |                   DATA STORE (server/data/store.json)           |   |
|   |  - Official Syllabus & Exercises                                |   |
|   |  - Peer Profiles, Streaks & Study Seconds                       |   |
|   |  - Daily Targets & Completion Details                           |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

### Stack Breakdown
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti, Vite.
- **Backend:** Node.js, Express 4.21, CORS.
- **Persistence:** Local JSON file database (`server/data/store.json`) with zero external database dependencies.
- **Deployment & Mobile:** Progressive Web App (PWA) with Service Worker (`sw.js`) and Web Manifest (`manifest.json`).

---

## 📂 Repository Directory Structure

```text
chaduvuko/
├── client/                     # Frontend Single Page Progressive Web App
│   ├── public/                 # Static assets & PWA configuration
│   │   ├── favicon.svg         # App favicon
│   │   ├── manifest.json       # Web App Manifest for mobile installation
│   │   ├── pwa-192.png         # 192x192 PWA Icon
│   │   ├── pwa-512.png         # 512x512 PWA Icon
│   │   ├── maskable-icon-512.png # Maskable adaptive Android icon
│   │   └── sw.js               # Service Worker for offline asset caching
│   ├── src/                    # Source code
│   │   ├── components/         # React UI Components
│   │   │   ├── AboutModal.tsx          # In-app About & BIEAP Blueprint guide
│   │   │   ├── CompleteTaskModal.tsx   # End task dialog (All vs Custom count)
│   │   │   ├── DailyTargets.tsx        # Daily to-do list & task cards
│   │   │   ├── GroupHub.tsx            # Peer circle hub & dual progress analytics
│   │   │   ├── Header.tsx              # Top bar, date picker, user drawer
│   │   │   ├── ManageUsersModal.tsx    # Member editor & app settings
│   │   │   ├── StudyTimer.tsx          # Pomodoro timer & stopwatch
│   │   │   ├── SyllabusEditorModal.tsx # Syllabus JSON editor
│   │   │   ├── SyllabusView.tsx        # BIEAP weightage syllabus explorer
│   │   │   ├── TargetModal.tsx         # Task creation modal with exercise picker
│   │   │   └── UserModal.tsx           # Add new student modal
│   │   ├── services/
│   │   │   └── api.ts                  # Client API client for backend
│   │   ├── App.tsx                     # Core application orchestrator
│   │   ├── main.tsx                    # Entry point & PWA registration
│   │   └── types.ts                    # TypeScript data definitions
│   ├── package.json            # Client dependencies & scripts
│   ├── vite.config.ts          # Vite bundler configuration
│   └── README.md               # Client-specific documentation
│
├── server/                     # Backend API Server
│   ├── data/
│   │   └── store.json          # Persistent JSON storage (created on launch)
│   ├── defaultData.js          # Official BIEAP 2nd Year Syllabus & Exercises
│   ├── index.js                # Express REST API & progress calculations
│   └── package.json            # Server dependencies
│
├── .gitignore                  # Git ignored files & folders
├── package.json                # Root orchestration package configuration
├── README.md                   # Repository comprehensive documentation
└── start-dev.js                # Dual-process launcher (backend + client)
```

---

## 🔌 REST API Reference

The backend runs on `http://localhost:3001` (or local network IP) with the following RESTful routes:

| Method | Endpoint | Description | Payload / Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/syllabus` | Fetch the complete BIEAP syllabus with chapter weightages and exercises | None |
| `POST` | `/api/syllabus` | Update the active syllabus structure | `{ syllabus: { Maths: [], Physics: [], Chemistry: [] } }` |
| `POST` | `/api/syllabus/reset` | Reset the syllabus back to official BIEAP defaults | None |
| `GET` | `/api/users` | List all student profiles in the study group | None |
| `POST` | `/api/users` | Add a new student profile | `{ name: string, avatar: string, targetScore: string }` |
| `PATCH` | `/api/users/:id` | Update profile details or add study seconds | `{ name?, avatar?, targetScore?, status?, addStudySeconds? }` |
| `DELETE` | `/api/users/:id` | Remove a student profile | None |
| `GET` | `/api/targets` | Get targets filtered by date or user | Query: `?date=YYYY-MM-DD&userId=u-1` |
| `POST` | `/api/targets` | Create a target for a specific student | `{ userId, subject, chapterId, chapterName, weightage, questionCategory?, exercise?, task, date }` |
| `POST` | `/api/targets/broadcast` | Broadcast and assign a target to **ALL** study group members | `{ subject, chapterId, chapterName, weightage, questionCategory?, exercise?, task, date }` |
| `PATCH` | `/api/targets/:id/toggle` | Toggle task completion status and record completed question count | `{ completedQuestionsType: "all" \| "custom", completedQuestionsCount?: number }` |
| `PATCH` | `/api/targets/:id/timer` | Log study seconds against a specific target and user | `{ seconds: number }` |
| `DELETE` | `/api/targets/:id` | Delete a target | None |
| `GET` | `/api/progress/:userId` | Get chapter completion status for a student | None |
| `POST` | `/api/progress/:userId` | Update chapter status (`not_started`, `in_progress`, `completed`, `revised`) | `{ chapterId: string, status: string }` |
| `GET` | `/api/group-overview` | Get collective group statistics, streaks, and dual progress bars | Query: `?date=YYYY-MM-DD` |
| `GET` | `/api/settings` | Get app branding title and sub-badge | None |
| `POST` | `/api/settings` | Update app branding title and sub-badge | `{ appTitle: string, appBadge: string }` |

---

## 🚀 Quick Start & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation
Clone or navigate to the repository directory:

```bash
# Clone the repository (if downloading from git)
git clone https://github.com/your-username/chaduvuko.git
cd chaduvuko

# Install root, backend, and client dependencies in one command
npm run build
```

Alternatively, install dependencies manually:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Database Configuration (Turso Cloud DB)
Chaduvuko uses **[Turso](https://turso.tech/)** (distributed serverless SQLite via LibSQL) for high-performance cloud storage and persistent tracking across all devices.

1. Create a free account at [turso.tech](https://turso.tech/) or install the Turso CLI:
   ```bash
   # On macOS/Linux: brew install tursodatabase/tap/turso
   # On Windows (PowerShell): irm https://get.turso.tech | iex
   ```
2. Create your database:
   ```bash
   turso db create chaduvuko
   turso db show --url chaduvuko
   turso db tokens create chaduvuko
   ```
3. Add your credentials to `server/.env` (or root `.env`):
   ```env
   TURSO_DATABASE_URL=libsql://chaduvuko-yourusername.turso.io
   TURSO_AUTH_TOKEN=your_auth_token_here
   ```
> *Note:* If no Turso credentials are provided, Chaduvuko automatically uses a local SQLite database (`data/chaduvuko.db`) with zero configuration required!

### Running the Application
Launch both the backend API server and the Vite client development server concurrently:

```bash
npm run dev
# OR: node start-dev.js
```

- **Client Dev URL:** [http://localhost:3000](http://localhost:3000)
- **Backend API URL:** [http://localhost:3001](http://localhost:3001)

---

### Connecting Android Devices over Local Wi-Fi

To open Chaduvuko on your Android smartphone or tablet:

1. Connect your computer and your Android phone to the **same Wi-Fi network**.
2. Find your computer's local IP address:
   - **On Windows (PowerShell):** `ipconfig` (look for *IPv4 Address*, e.g., `192.168.1.6`)
   - **On macOS / Linux:** `ifconfig` or `ip a` (look for `inet 192.168.x.x`)
3. Open Chrome on your Android phone and browse to:
   ```text
   http://<YOUR_COMPUTER_IP>:3000
   ```
   *(Example: `http://192.168.1.6:3000`)*

---

### Installing as an Android PWA App

For an immersive, full-screen, distraction-free study experience:

1. Open `http://<YOUR_COMPUTER_IP>:3000` in **Chrome for Android**.
2. Tap the **three dots menu (⋮)** in the upper right corner of Chrome.
3. Select **"Install app"** or **"Add to Home screen"**.
4. Confirm installation.
5. Chaduvuko now launches from your phone's app drawer with no URL bar, full-screen view, and instant touch responsiveness!

---

## 🧭 Recommended Student Daily Workflow

To maximize your BIEAP board score, follow this proven daily routine with your study circle:

```text
  MORNING (8:00 AM)                 AFTERNOON (2:00 PM)                EVENING (8:00 PM)
+-----------------------+         +-----------------------+         +-----------------------+
|  Set Daily Targets    |         |  Deep Focus Sprints   |         |  End Tasks & Review   |
|  - Pick high-yield    |  ---->  |  - Run Pomodoro Timer |  ---->  |  - Log question counts|
|    exercises (e.g.    |         |    (25m or 45m blocks)|         |  - Check Group Hub    |
|    Ex 7.2 or 4.1)     |         |  - Study with friends |         |    streaks & syllabus %|
|  - Broadcast to group |         |    without distraction|         |  - Celebrate wins!    |
+-----------------------+         +-----------------------+         +-----------------------+
```

1. **Morning Planning:**
   - Open Chaduvuko on your phone.
   - Tap **"Add Target"**. For Maths, choose a specific exercise (e.g. *Integrals &rarr; Exercise 7(b)*).
   - If studying together, check **"Create Task for ALL Members"** to assign it to your whole group.
2. **Focus Study Sprints:**
   - Tap the **Timer** icon on your task card or switch to the **Timer tab**.
   - Start a 25-minute Pomodoro session. Your study seconds automatically count toward your streak and target.
3. **Ending the Task:**
   - When finished, tap **"End Task"**.
   - If you solved all problems in that exercise, tap **"All Questions"**. If you solved a subset (e.g. 8 questions), enter `8`.
4. **Group Accountability:**
   - Tap **Friends** to check your peers' completion rate, see who's currently studying, and maintain your daily streak!

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for peer study circles, schools, and academic coaching centers.
