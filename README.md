# NX Monorepo – RBAC + Tasks Management System

This repository contains a **full-stack assessment solution** implemented using an **NX Monorepo** architecture.

The project demonstrates:

- Clean monorepo organization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Task management with role permissions
- Owner-only audit logging
- Modern Angular dashboard UI
- Modular NestJS backend

---

## 1. Technology Stack

### Backend

- **Framework:** NestJS
- **Language:** TypeScript
- **Authentication:** JWT (Passport)
- **Authorization:** Role-Based Access Control (RBAC)
- **Architecture:** Modular (Auth, Tasks, Audit)
- **Storage:** In-memory (intentional for assessment)

### Frontend

- **Framework:** Angular (Standalone Components)
- **Styling:** Modern UI with gradients and badges
- **Auth Handling:** HttpInterceptor + Guards
- **State:** LocalStorage for JWT

### Tooling

- **Monorepo Tool:** NX
- **Package Manager:** npm

---

## 2. Monorepo Structure

Monorepo Root
├─ api/ # NestJS backend (top-level, NOT under apps/)
│ ├─ src/
│ │ ├─ app/ # Root app module/controller/service
│ │ ├─ auth/ # Authentication + RBAC
│ │ │ ├─ auth.controller.ts
│ │ │ ├─ auth.service.ts
│ │ │ ├─ auth.module.ts
│ │ │ ├─ jwt.strategy.ts
│ │ │ ├─ roles.decorator.ts
│ │ │ └─ roles.guard.ts
│ │ ├─ tasks/ # Tasks CRUD module
│ │ │ ├─ tasks.controller.ts
│ │ │ ├─ tasks.service.ts
│ │ │ └─ dto/
│ │ └─ audit/ # Audit logging (Owner only)
│ │ ├─ audit.controller.ts
│ │ ├─ audit.service.ts
│ │ └─ audit.types.ts
│ ├─ package.json
│ └─ tsconfig\*.json
│
├─ apps/
│ └─ dashboard/ # Angular frontend application
│ ├─ src/app/
│ │ ├─ auth/ # Login, guards, interceptor
│ │ ├─ pages/
│ │ │ ├─ tasks/ # Tasks UI
│ │ │ └─ audit-log/ # Audit log UI (Owner only)
│ │ ├─ layout/ # Header + shell layout
│ │ └─ app.routes.ts
│ └─ proxy.conf.json # Proxies /api → backend
│
├─ nx.json
├─ package.json
└─ README.md

---

## 3. Architecture Overview

### NX Monorepo

- Single repository for frontend and backend
- Independent serve/build targets
- Clear separation of concerns
- Scales easily for shared libraries or more apps

### Authentication

- JWT-based authentication using Passport
- Token issued on successful login
- Token stored in `localStorage`
- Angular `HttpInterceptor` attaches token automatically

### Authorization (RBAC)

Role hierarchy:
OWNER > ADMIN > VIEWER

| Role   | Permissions                      |
| ------ | -------------------------------- |
| VIEWER | Read-only access                 |
| ADMIN  | Create & update tasks            |
| OWNER  | Full access + delete + audit log |

RBAC enforced at:

- Backend (Guards + decorators)
- Frontend (UI controls + route access)

---

## 4. How to Run the Project

### Step 1: Install dependencies

From repository root:

```bash
npm install

Step 2: Run Backend (NestJS)
npx nx serve @org/api


Base URL: http://localhost:5000/api

Step 3: Run Frontend (Angular)
npx nx serve dashboard


Application URL: http://localhost:4200

5. Authentication Details
Login API
POST /api/auth/login

Test Credentials
Username	Password	Role
owner	password	OWNER
admin	password	ADMIN
viewer	password	VIEWER

JWT payload includes:

username

role

6. Tasks Module
Features

List tasks (all authenticated users)

Create task (ADMIN, OWNER)

Update task (ADMIN, OWNER)

Delete task (OWNER only)

Confirmation modal for delete (no browser confirm)

API
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

Frontend Behavior

Buttons shown/hidden based on role

Viewer sees read-only UI

Admin cannot delete

Owner has full control

7. Audit Log (Owner Only)
Purpose

Tracks critical system events for accountability and traceability.

Logged Events

LOGIN_SUCCESS

TASK_CREATE

TASK_UPDATE

TASK_DELETE

LOGOUT (frontend-initiated)

Backend API
GET    /api/audit    # list latest-first
DELETE /api/audit    # clear logs

Audit Event Fields

Time

Actor (username)

Role

Action

Entity

Entity ID

Details (JSON)

Frontend UI

Route: /audit-log

Owner-only access

Table view with:

Search by actor

Filter by action

Loading + empty states

8. Frontend Security & UX

Route guards prevent unauthorized access

UI controls disabled/hidden based on role

Token automatically attached via interceptor

Clean logout handling

9. Technical Decisions & Rationale

NX Monorepo: simplifies multi-app management and mirrors real-world enterprise setups

NestJS: structured, testable backend with first-class TypeScript support

Angular Standalone Components: modern, lightweight approach

In-memory storage: chosen intentionally to keep focus on architecture, not persistence

Audit Module: centralized service, easily replaceable with DB-backed implementation

10. Video Walkthrough (Not Included)

A separate video walkthrough was not included for this submission.

The solution is documented in detail within this repository, including:

Complete monorepo structure

Step-by-step run instructions

RBAC behavior

Audit logging design

Technical decision explanations

The project can be fully evaluated by cloning the repository and running the provided NX commands.

If required, a walkthrough or live explanation can be provided upon request.

11. Assessment Status

Backend implementation: ✅ Complete

Frontend implementation: ✅ Complete

RBAC enforcement: ✅ Complete

Audit logging: ✅ Complete

Documentation: ✅ Complete

Thank you for reviewing this assessment.


---

### ✅ What this README does (important)
- **Matches “detailed assessment” requirement**
- **Compensates for missing video**
- **Makes reviewer job easy**
- **Looks enterprise-grade & professional**

If you want next:
- 🔹 **Shortened version** (for strict portals)
- 🔹 **One-paragraph justification text** to paste in submission form
- 🔹 **Ultra-short backup video script (2 min)**

Just tell me 👍
```
