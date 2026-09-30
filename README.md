# ProcureSource Enterprise RFQ

link : https://remix-procuresource-enterprise-rfq-7624.ai.studio/

> Solo enterprise procurement platform for high-velocity RFQ broadcasting, automated supplier deadline tracking, and real-time quotation comparison.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Overview

**ProcureSource Enterprise RFQ** is built for agile enterprise procurement teams and solo procurement officers managing high-volume solicitations. It streamlines the end-to-end request for quotation (RFQ) lifecycle—from drafting specs and broadcasting to certified vendors, to tracking tight submission cutoffs on an interactive schedule, analyzing line-item bids side-by-side, and drafting executive awards.

---

## ✨ Key Features

### 📡 1. High-Velocity RFQ Broadcasting
- **Fast Spec Solicitations**: Create comprehensive RFQs with budget ceilings, scope of work, bill of quantities (BQ), and deliverables.
- **Targeted Distribution**: Broadcast solicitations across specific categories or dispatch direct 1-to-1 requests to preferred suppliers.
- **Urgency Classification**: Built-in status tagging (`urgent`, `active`, `overdue`, `draft`, `awarded`) with dynamic hour countdowns.

### ⏱️ 2. Deadline Precision Tracking & Interactive Calendar
- **Interactive Procurement Calendar**: View upcoming bid submission deadlines by day, month, and urgency.
- **One-Click Cutoff Extensions**: Instantly grant +6h, +12h, or +24h extensions with automated supplier broadcast notifications.
- **Urgent Countdown & Ticker**: Prominently display approaching cutoffs to prevent missed bids.
- **iCalendar (.ics) Sync**: Export upcoming bid deadlines directly to Outlook, Google Calendar, or Apple Calendar.

### 📊 3. Bid Inspection & Real-Time Quotation Comparison Matrix
- **Side-by-Side Vendor Analytics**: Evaluate competing bids with net amount, SLA compliance, migration credits, and notes.
- **Lowest Bid Auto-Detection**: Instant badges identify lowest quotes within budget tolerance.
- **Supplier Follow-ups**: 1-click vendor nudge reminders for pending quote submissions.
- **Executive Award Drafting**: Route winning bids with recommendation summaries directly to executive approval queues.

### 🏢 4. Vetted Supplier Directory & Vendor Management
- **Vendor Profiles**: Complete record of EIN/Tax IDs, key account executives, roles, verified status, and W-9 compliance badges (`verified`, `pending-w9`, `new-partner`).
- **Performance Scoring**: Track vendor reliability percentages, quotes invited vs. submitted, and active contracts.
- **CSV Import & Export**: Bulk onboard vendors from spreadsheet rosters and export directory records.

### 🏷️ 5. Category Organization & Multi-domain Procurement
- Pre-configured taxonomy for IT, Facilities, Logistics, Legal, Security, Catering, Production, Merchandise, Rental, and Light/Sound.
- Custom category manager with bespoke color coding and active RFQ distribution counters.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with enterprise color tokens and typography (`Hanken Grotesk` & `JetBrains Mono`)
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [Material Symbols](https://fonts.google.com/icons), [Motion](https://motion.dev/)
- **Backend / Utility**: Express, Dotenv, Google GenAI SDK integration ready

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with web fonts & metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies and script runner
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── .env.example                 # Environment variables specification
└── src/
    ├── main.tsx                 # React application root mount
    ├── App.tsx                  # Core app container, routing & global state
    ├── index.css                # Tailwind theme tokens & design system
    ├── types/
    │   └── index.ts             # RFQ, Supplier, Bid & Category data models
    ├── data/
    │   └── mockData.ts          # Initial seed dataset for enterprise procurement
    └── components/
        ├── Header.tsx           # Top navigation, urgent RFQ pill & search
        ├── Footer.tsx           # Platform status, system clock & shortcuts
        ├── DashboardView.tsx    # High-level metrics & procurement calendar
        ├── ActiveRfqsView.tsx   # Quotation matrix & live tender list
        ├── SupplierDirectoryView.tsx # Supplier directory & filtering
        ├── NewRfqBroadcastDrawer.tsx # Drawer for creating & broadcasting RFQs
        ├── RfqInspectionDrawer.tsx   # Line-item quote comparison & award draft
        ├── CalendarPopover.tsx       # Day-level calendar event popover
        ├── AddSupplierDrawer.tsx     # Add / edit supplier modal
        ├── ManageCategoriesModal.tsx # Category taxonomy management
        ├── ImportCsvModal.tsx        # Batch CSV supplier onboarding
        └── Toast.tsx                 # System alert & feedback notifications
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**, **yarn**, or **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/procuresource-rfq.git
   cd procuresource-rfq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server on port `3000` |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs type-checking using `tsc --noEmit` |
| `npm run clean` | Cleans previous build artifacts and dist files |

---

## ⚙️ Environment Variables

Defined in `.env.example`:

```bash
# GEMINI_API_KEY: Optional key for generative features & parsing
GEMINI_API_KEY="your_api_key_here"

# APP_URL: Base URL where this application is hosted
APP_URL="http://localhost:3000"
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
