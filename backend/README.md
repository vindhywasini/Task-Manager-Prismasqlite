# Task Management System - Backend (Node.js + TypeScript + Prisma + SQLite)

## Setup

1. Install deps:
   npm install

2. Generate Prisma client & run migrations:
   npx prisma generate
   npx prisma db push

3. Run dev server:
   npm run dev

Default server: http://localhost:4000

Endpoints:
- POST /auth/register { email, password, name? }
- POST /auth/login { email, password } -> returns { accessToken } and sets refreshToken cookie
- POST /auth/refresh -> send cookie, returns new accessToken
- POST /auth/logout -> clears cookie
- Protected routes require Authorization: Bearer <accessToken>
- Tasks endpoints under /tasks
