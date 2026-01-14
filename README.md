# NPC Registry

A lightweight NPC (Non-Player Character) management tool designed for tabletop RPG game masters.

This project focuses on clean React architecture, predictable state management, and scalable form handling without heavy external libraries.

---

## ✨ Features

- Create, edit, and delete NPCs
- Schema-driven form validation
- Reducer-based modal state management
- Reusable form components and hooks
- Clean separation of UI, state, and domain logic

---

## 🧠 Architectural Highlights

See [Architecture Overview](docs/architecture.md) for design decisions.

- **Reducer-driven modal state**  
  Modal visibility and context are handled via a single reducer instead of boolean flags.

- **Custom form hook (`useNpcForm`)**  
  Encapsulates form state, validation, and submission logic.

- **Schema-first validation**  
  Validation rules drive both UI behavior and form validation logic.

- **Reusable UI primitives**  
  Components like `FormField`, `FormActions`, and `ModalShell` are domain-agnostic.

This project includes a small but intentionally structured backend to demonstrate realistic frontend/backend boundaries.

---

## 🛠 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Custom validation (no form libraries)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Install
```bash
npm install

