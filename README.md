# NPC Registry

A full-stack NPC (Non-Player Character) management platform for tabletop RPG Game Masters, designed to demonstrate **production-grade frontend architecture, backend services, AI-assisted narrative tooling, automated testing, and DevSecOps security practices**.

This project goes beyond CRUD by integrating a Python narrative engine, structured API services, and a security hardening probe enforced through CI.

---

## ✨ Core Features

### Frontend (React)

* Create, edit, and delete NPCs
* Schema-driven form validation
* Reducer-based modal state management
* Reusable form components and hooks
* Clean separation of UI, state, and domain logic

---

### Backend (Node API)

* REST API for NPC and GM Secrets management
* Structured request validation
* Service-layer separation
* Automated API testing
* CI-enforced quality gates

---

### Narrative Engine (Python Microservice)

* AI-assisted narrative analysis
* Secret risk assessment logic
* Structured result generation
* Unit tested
* CI integrated

---

### Security & DevSecOps

* Automated Linux hardening probe
* Security scan runs on every pull request
* CI pipeline blocks merges on critical findings
* Artifact-based security reports
* Baseline tracking and change detection

---

## 🧠 Architectural Highlights

See [Architecture Overview](docs/architecture.md) for frontend design decisions.

### Frontend Architecture

* **Reducer-driven modal state**
  Modal visibility and context handled via reducer instead of scattered booleans.

* **Custom form hook (`useNpcForm`)**
  Encapsulates form state, validation, and submission logic.

* **Schema-first validation**
  Validation rules drive both UI behavior and validation logic.

* **Reusable UI primitives**
  `FormField`, `FormActions`, `ModalShell` remain domain-agnostic.

---

### Backend Architecture

* Clear controller → service → data flow
* API boundary enforcement
* Isolated test environment
* Designed for containerization

---

### Python Narrative Engine Architecture

* Stateless request handling
* Structured JSON I/O
* Separation of collection, processing, and analysis logic
* Designed for independent scaling

---

### Security Hardening Architecture

The hardening probe is intentionally structured as a **standalone security tool**:

* Snapshot collection
* Normalization layer
* Risk analysis engine
* CI enforcement output

This simulates real-world DevSecOps security gates.

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

---

### Backend

* Node.js
* Express
* MongoDB (Atlas/local)
* Jest / Supertest

---

### Narrative Engine

* Python
* FastAPI (or service layer)
* Pytest

---

### DevSecOps

* GitHub Actions
* Security artifact reporting
* CI gating
* Automated testing pipeline

---

## 🧪 Testing Strategy

This project intentionally uses **layered testing**, mirroring real production environments.

### Backend Tests

* API route validation
* Service logic testing
* Database boundary testing

---

### Python Engine Tests

* Narrative logic validation
* Risk scoring accuracy
* Structured output verification

---

### Frontend Tests (Planned)

* Component unit tests
* Minimal UI integration tests
* Minimal end-to-end coverage for core flows

---

## 🔐 CI Pipeline

Every push and pull request triggers:

```
Python Narrative Engine Tests
Node Backend API Tests
Security Hardening Probe Scan
```

---

### Security Enforcement Rules

| Condition            | Result                      |
| -------------------- | --------------------------- |
| No critical findings | Build passes                |
| Critical findings    | Build fails + merge blocked |

---

### CI Artifacts

Security reports are uploaded automatically:

```
hardening-probe/output/security_report.json
```

---

## 📁 Project Structure (High Level)

```
npc-registry/
├── frontend/
├── backend/
├── narrative-engine/
├── hardening-probe/
├── .github/workflows/
└── docs/
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* Python 3.10+
* MongoDB (local or Atlas)

---

### Install Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### Install Backend

```bash
cd backend
npm install
npm test
npm run dev
```

---

### Install Narrative Engine

```bash
cd narrative-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest
```

---

### Run Security Probe (Local)

```bash
cd hardening-probe
python main.py
```

---

## 🎯 Project Goals

NPC Registry is built to demonstrate:

* Real-world frontend architecture
* Backend service design
* Microservice integration
* Automated testing culture
* DevSecOps pipeline practices
* Security-first thinking

This is intentionally designed as **portfolio-grade engineering**, not a tutorial demo.
