# Feature Specification & Technical Blueprint: EmirIT Corporate Website

## 1. Project Overview
EmirIT is an enterprise IT services provider specializing in computer hardware & components, network infrastructure, and cloud solutions. This specification defines the architecture, user journeys, data structures, and styling guidelines for a modern, responsive, high-performance vanilla web application.

---

## 2. Technical Stack & Architecture Constraints
- **Frontend Core:** Semantic HTML5, Modular CSS3 (Custom Properties / Flexbox & CSS Grid), Vanilla ES6+ JavaScript.
- **Dependencies:** 0 External Frameworks/Libraries (no external npm dependencies or CDN script dependencies; all self-contained and clean).
- **Architecture Style:** Component-driven semantic markup with accessible DOM nodes (WCAG 2.1 AA compliant), decoupled stylesheet variables, and event-driven modular JavaScript.

---

## 3. Visual & Design Guidelines
- **Color Palette:**
  - Primary / Deep Blue: `#0a192f` / `#0f172a`
  - Accent / Vibrant Cyan: `#00d2ff` / `#0ea5e9`
  - Secondary Slate Gray: `#334155` / `#64748b`
  - Background Neutral: `#f8fafc` (Light) / `#090d16` (Deep canvas)
  - Card & Surface: `#ffffff` / `#0f172a` with subtle borders (`#e2e8f0` / `#1e293b`)
  - Accent Hover & Gradient: `linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)`
- **Typography:** Modern clean sans-serif system stack (`system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`).
- **Responsive Breakpoints:**
  - Mobile: `< 640px`
  - Tablet: `640px - 1024px`
  - Desktop: `> 1024px`

---

## 4. Component Breakdown & Functional Requirements

### 4.1 Global Navigation Header
- Sticky header with backdrop blur effect.
- Brand logo mark with interactive hover state.
- Desktop navigation links with active state indicator and smooth scrolling.
- Accessible mobile drawer toggle (hamburger menu) with full keyboard accessibility (`aria-expanded`, focus trap, escape key closing).

### 4.2 Hero Section
- Dynamic headline highlighting enterprise IT capabilities.
- Direct dual CTA buttons: "Explore Services" and "Request IT Assessment".
- Live KPI counter metric cards (`99.99% Uptime SLA`, `24/7/365 Rapid Response`, `500+ Deployments`).
- Visual tech graphic/illustration crafted in responsive pure CSS/SVG.

### 4.3 Core Services Overview
- Triple-pillar cards mapping the three core domains:
  1. Computer Hardware & Components
  2. Network Infrastructure
  3. Cloud Services & Solutions
- Interactive quick-jump links to detailed sections.

### 4.4 Hardware & Components Catalog Grid
- Interactive category filtering tabs:
  - All Items
  - Workstations & Custom PCs
  - Enterprise Servers
  - Storage & NAS Systems
  - Component Upgrades (RAM, GPUs, SSDs)
- Responsive card grid displaying specs, warranty badges, and "Request Spec Sheet" CTA triggers.
- Live client-side search/filter state update without page reload.

### 4.5 Network Infrastructure Deep-Dive
- Visual blueprint display detailing:
  - Zero-Trust Security & Next-Gen Firewalls (NGFW)
  - Structured Cabling & Fiber Optic Backbones
  - High-Density Wi-Fi 6E/7 Deployments
  - Proactive 24/7 Network Operations Center (NOC) Monitoring
- Interactive SLA & network health visual cards with interactive feature expansion.

### 4.6 Cloud Services & Modern Solutions
- Comparison & solution showcase highlighting Hybrid Cloud (AWS/Azure/GCP), Disaster Recovery, Virtual Desktops (VDI), and Cloud Cost Governance.
- Interactive cloud readiness checklist / interactive architecture estimator.

### 4.7 Interactive Service Request & Consultation Quote Form
- Comprehensive request form with client-side real-time validation:
  - Full Name (required, min 2 chars)
  - Business Email (required, regex validated corporate/valid email)
  - Phone Number (optional/formatted)
  - Selected Core Service (Hardware, Network, Cloud, or Multi-Service)
  - Estimated Project Timeline / Infrastructure Scale
  - Project Details / Technical Requirements (min 10 chars)
  - Consent checkbox
- Visual error states, assistive helper text (`aria-describedby`), and accessible announcement banners.
- Simulated instant quote/ticket submission with instant response confirmation dialog.

### 4.8 Footer Section
- Company metadata, legal links, ISO/compliance badges, direct contact info, and newsletter/status indicator.

---

## 5. Developer Implementation Tasks
1. **Task 1 (Developer Agent):** Build `index.html` featuring full semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`), ARIA attributes, meta tags, and structured content.
2. **Task 2 (Developer Agent):** Build `styles.css` containing root design tokens, responsive grid layouts, animations, transitions, and dark/light contrast conformity.
3. **Task 3 (Developer Agent):** Build `app.js` containing mobile navigation controller, smooth scroll spy, hardware catalog filter engine, live form validator, and toast notification system.
4. **Task 4 (Auditor Agent):** Comprehensive audit across WCAG 2.1 AA accessibility, responsive behavior, security, and catalog filter functionality, producing `audit_report.json`.
5. **Task 5 (Supervisor Agent):** Review test results, ensure 100% test pass rate, and issue `final_approval_status.json`.

