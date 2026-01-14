# Architecture Overview

This document outlines the architectural decisions behind the NPC Registry project and explains *why* certain patterns were chosen.

The goal of this application is clarity, predictability, and long-term maintainability — not reliance on heavy abstraction libraries.

---

## Core Principles

1. **Single Source of Truth**
2. **Explicit State Transitions**
3. **Schema-Driven Behavior**
4. **Composable, Reusable UI Primitives**
5. **Minimal External Dependencies**

---

## High-Level Structure

src
 ┣ components
 ┃ ┣ forms
 ┃ ┃ ┣ FormActions.tsx
 ┃ ┃ ┗ FormField.tsx
 ┃ ┣ modals
 ┃ ┃ ┣ ConfirmDeleteModal.tsx
 ┃ ┃ ┣ ModalShell.tsx
 ┃ ┃ ┗ NpcFormModal.tsx
 ┃ ┣ npc
 ┃ ┃ ┣ NpcCard.tsx
 ┃ ┃ ┣ NpcDashboard.tsx
 ┃ ┃ ┣ NpcForm.tsx
 ┃ ┃ ┗ NpcList.tsx
 ┃ ┣ ui
 ┃ ┃ ┗ LoadingBar.tsx
 ┃ ┗ Modal.tsx
 ┣ hooks
 ┃ ┗ useNpcForm.ts
 ┣ reducers
 ┃ ┗ modalReducer.ts
 ┣ services
 ┃ ┗ npcService.ts
 ┣ types
 ┃ ┣ AsyncStatus.ts
 ┃ ┣ ModalState.ts
 ┃ ┣ Npc.ts
 ┃ ┗ NpcForm.ts
 ┣ validation
 ┃ ┣ npcValidateForm.ts
 ┃ ┗ npcValidation.ts
 ┣ App.css
 ┣ App.tsx
 ┣ index.css
 ┗ main.tsx


Each folder represents a single responsibility:

- **components** → UI composition only
- **hooks** → reusable state and logic
- **reducers** → explicit UI state machines
- **services** → API boundaries
- **types** → shared domain contracts
- **validation** → schema-first rules

---

## Modal State Management

### Problem

Managing multiple modal states with booleans leads to:
- conflicting states
- unclear transitions
- hard-to-follow logic

### Solution

All modal state is managed through a reducer:

```ts
mode: "closed" | "create" | "edit" | "confirmDelete"
npc: Npc | null

npcValidation = {
  name: { required, minLength, maxLength },
  role: { ... }
}

---

## Backend Architecture (Lightweight but Intentional)

While the frontend is the primary focus of this project, the backend is designed to be small, explicit, and useful — not an afterthought.

The backend exists to:
- provide a clean API boundary
- persist NPC data
- model real-world frontend/backend interaction

It intentionally avoids overengineering.

---

## Backend Structure

src
 ┣ models
 ┃ ┗ Npc.ts
 ┣ routes
 ┃ ┗ npcs.ts
 ┣ utils
 ┃ ┗ mapNpc.ts
 ┣ .env
 ┣ db.ts
 ┣ index.ts
 ┣ package-lock.json
 ┣ package.json
 ┗ tsconfig.json


Each layer has a clear responsibility:

- **models/**  
  Database schemas and persistence definitions

- **routes/**  
  HTTP endpoints and request handling

- **utils/**  
  Data transformation and mapping logic

- **db.ts**  
  Database connection and initialization

- **index.ts**  
  Application bootstrap and server setup

This separation ensures that business logic, transport concerns, and persistence remain decoupled.

---

## Data Mapping & API Boundaries

The backend avoids leaking database models directly to the frontend.

Instead, utility functions are used to:
- map database documents to API-safe objects
- control exactly what data is exposed
- keep the frontend independent of persistence details

This mirrors real-world service boundaries and prevents tight coupling.

---

## Why a Small Backend?

This backend is intentionally minimal because:

- the architectural focus is on frontend state and UI modeling
- complexity is added only when it provides value
- the API surface is easy to reason about and test

Despite its size, the backend demonstrates:
- clear separation of concerns
- predictable data flow
- realistic full-stack integration

---

## Scalability Considerations

The backend structure supports future growth without refactoring:

- additional routes can be added without affecting existing ones
- validation can be shared or expanded
- authentication and authorization layers can be introduced cleanly
- services can be extracted if needed

The backend is small by design, but not fragile.
