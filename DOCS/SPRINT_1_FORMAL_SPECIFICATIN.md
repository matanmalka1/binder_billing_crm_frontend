# Frontend Sprint 1 – Formal Specification

## Project
Binder & Billing CRM – Frontend

## Sprint
Sprint 1 – Frontend Foundation & First Screens

## Status
DRAFT (Pending Freeze)

---

## 1. Purpose

Sprint 1 establishes the **frontend foundation** for the Binder & Billing CRM system and delivers the **first operational UI screens**.

This sprint focuses on:
- Project scaffolding
- Architectural conventions
- UI primitives
- Initial routing
- Read-only data flow from backend
- Hebrew-first UI

No advanced logic, mutations, or workflows are implemented at this stage.

---

## 2. Technology Stack (Frozen)

### Core
- React
- Vite
- TypeScript (strict mode)

### Styling
- TailwindCSS
- No external UI frameworks

### State & Data
- Axios (single HTTP client)
- Zustand (minimal global state)

### Routing
- react-router-dom

### Language
- **Hebrew only (RTL)**
- No i18n libraries

### Forbidden (Hard Rules)
- ❌ Gemini / any AI SDK
- ❌ MUI / Ant / Chakra / Mantine
- ❌ Redux / MobX / React Query
- ❌ Form libraries (Formik / RHF)
- ❌ Chart libraries
- ❌ Auth SDKs (Clerk / Firebase / Supabase)

---

## 3. Architectural Rules

- Component-based architecture
- Clear separation:
  - UI primitives
  - Layouts
  - Pages
  - API layer
  - Stores
- No business logic in UI components
- No data mutations in Sprint 1
- API calls are read-only
- All files must remain reasonably small and readable

---

## 4. Folder Structure (Initial)

```text
src/
├─ api/
│  └─ client.ts          # Axios instance
│
├─ components/
│  ├─ ui/                # Primitive components
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ Badge.tsx
│  │  └─ Loader.tsx
│  │
│  └─ layout/
│     ├─ AppLayout.tsx
│     └─ PageHeader.tsx
│
├─ pages/
│  ├─ Dashboard.tsx
│  ├─ Binders.tsx
│  ├─ Clients.tsx
│  └─ Login.tsx
│
├─ router/
│  └─ index.tsx
│
├─ store/
│  └─ auth.store.ts
│
├─ types/
│  └─ api.ts
│
├─ utils/
│  └─ cn.ts
│
├─ App.tsx
└─ main.tsx