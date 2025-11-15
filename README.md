# TrackToSuccess – Task Management System

A full-stack **Task Management System** built with:

- **Backend**: Node.js, TypeScript, Express, Prisma, SQLite, JWT (Access + Refresh), bcrypt
- **Frontend**: Next.js (App Router) + TypeScript
- **Features**: Authentication, secure task CRUD, pagination, filtering, searching, responsive & modern UI with dark mode

---

##  Features

### Backend (Node.js + TypeScript + Prisma)

- **User Authentication**
  - Register, Login, Logout
  - JWT-based auth:
    - **Access Token** (short-lived) in JSON response
    - **Refresh Token** (long-lived) stored as HttpOnly cookie
  - Passwords hashed with **bcrypt**
  - Auth middleware to protect `/tasks` routes

- **Task Management**
  - Each task belongs to a **specific user**
  - Full CRUD:
    - Create, View, Edit (partial update), Delete
    - Toggle completion status
  - List endpoint supports:
    - **Pagination** (`page`, `limit`)
    - **Filtering** by status (`pending`, `completed`)
    - **Search** by title (`search` query)

- **Validation & Error Handling**
  - Request body validation with **Zod**
  - Clear HTTP status codes: `400`, `401`, `404`, `500`, etc.

### Frontend (Next.js + TypeScript)

- **Authentication Pages**
  - `/login` and `/register` pages
  - Connect to backend API
  - Access token stored in `localStorage`
  - Refresh token handled via HttpOnly cookie (backend)

- **Task Dashboard (`/`)**
  - Modern, responsive **Task Manager** UI
  - Beautiful branding: **TrackToSuccess**
  - **Dark mode** toggle (persisted in `localStorage`)
  - Task list with:
    - Search input
    - Status filter dropdown (All / Pending / Completed)
    - Pagination controls
    - Summary chips: completed, pending, total
  - Inline actions:
    - Toggle status (Mark Pending / Mark Done)
    - Delete task

- **Task Creation**
  - Form to add new tasks (title + optional description)
  - UI toasts for success and error feedback



