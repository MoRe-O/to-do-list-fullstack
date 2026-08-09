# To-Do List — React + OTP Auth

A full-stack task manager built with a React/Vite/Tailwind frontend and a Node.js/Express/SQLite backend, featuring email OTP-based authentication (no passwords), search, sorting, and a glassmorphism UI with an animated particle background.

## Overview

Unlike a typical local-state todo app, this one talks to a real backend over a REST API: a user enters their email, receives a one-time code, and verifying that code either logs them in or creates their account — login and signup are the same single flow, since there's no password to set up separately. Every task action (add, delete, complete, search, sort) is persisted server-side and re-fetched from the API.

## Features

- **Passwordless login & signup in one step** — enter your email, receive a one-time code by email, verify it to get a session token; a new email is registered automatically the first time it's verified
- **Session persistence** — auth token stored in `localStorage`, so a refresh doesn't log you out
- **Task management** — add, delete, and toggle tasks as complete, scoped per user
- **Search** — live search by task title
- **Sort** — sort by latest, earliest, or filter to completed only
- **Animated UI** — glassmorphism cards over a particle-based animated background, with toast notifications for feedback (including OTP and task errors)

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS
- react-toastify

**Backend**
- Node.js + Express
- SQLite (`better-sqlite3`) — zero-setup file-based database
- JSON Web Tokens for session auth
- `bcryptjs` for hashing OTP codes at rest
- `nodemailer` for sending the OTP email (falls back to logging the code to the console if SMTP isn't configured, so it runs out of the box in development)

## Project Structure

```
to-do-list/
├── src/
│   ├── App.jsx                  # Routes: login/signup, OTP verification, home
│   ├── main.jsx                 # Entry point
│   ├── pages/
│   │   ├── LoginPage.jsx        # Email entry, requests OTP
│   │   ├── OTPPage.jsx          # OTP verification, exchanges code for a session token
│   │   └── Home.jsx             # Main task list + all task API calls
│   └── components/
│       ├── Header.jsx           # Shows logged-in user's email
│       ├── Navbar.jsx           # Search bar, sort dropdown, add-task button
│       ├── NoteList.jsx         # Renders the task list
│       ├── Popover.jsx          # Add-task modal
│       ├── Input.jsx
│       ├── ConfirmButton.jsx
│       ├── ThemeProvider.jsx
│       └── ParticleBackground.jsx
└── backend/
    └── src/
        ├── server.js             # Express app entry point
        ├── db.js                 # SQLite connection + schema
        ├── middleware/
        │   └── auth.js           # JWT verification middleware
        ├── services/
        │   ├── otp.js            # OTP generation, hashing, expiry, attempt limits
        │   └── mailer.js         # Sends the OTP email (or logs it in dev)
        └── routes/
            ├── users.js          # send-otp / verify-otp / current user
            └── tasks.js          # Task CRUD, scoped to the authenticated user
```

## How to Run

### Backend
1. `cd backend`
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file from the template and fill in a JWT secret:

   macOS / Linux:
   ```
   cp .env.example .env
   ```
   Windows (Command Prompt):
   ```
   copy .env.example .env
   ```
   Windows (PowerShell):
   ```
   Copy-Item .env.example .env
   ```
   Then open `.env` in an editor and set `JWT_SECRET` to any long random string.
4. Start the server:
   ```
   npm start
   ```
   The API runs on `http://localhost:3003` by default. Without SMTP credentials in `.env`, verification codes aren't emailed — instead, watch this terminal window. Each time you request a code, a line like this is printed:
   ```
   [OTP] SMTP is not configured — verification code for you@example.com is: 483920
   ```
   Copy that code into the OTP screen on the frontend to log in. This is enough for local development and testing; no email account is required.

### Frontend
1. From the project root, install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file from the template if you want to point at a backend other than `http://localhost:3003/`:

   macOS / Linux:
   ```
   cp .env.example .env
   ```
   Windows (Command Prompt):
   ```
   copy .env.example .env
   ```
   Windows (PowerShell):
   ```
   Copy-Item .env.example .env
   ```
3. Start the dev server:
   ```
   npm run dev
   ```

## Running on Windows — notes

- `better-sqlite3` (used by the backend) compiles a native module on install. This normally works out of the box with a plain `npm install`, but if it fails, install the "Desktop development with C++" workload from the [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and re-run `npm install`.
- Run the backend and frontend in two separate terminal windows/tabs — `npm start` in `backend/` and `npm run dev` in the project root — since neither command exits on its own.
- If Windows Defender Firewall prompts to allow Node.js to accept connections the first time you run the backend, allow it on private networks so `http://localhost:3003` is reachable from the frontend.
- Paths in this project use forward slashes (`/`) throughout the code, which Node handles correctly on Windows as well — no path changes are needed.

## API Reference

| Method | Endpoint             | Auth | Description                                  |
|--------|-----------------------|------|-----------------------------------------------|
| POST   | `/users/send-otp`     | —    | Send a one-time code to an email              |
| POST   | `/users/verify-otp`   | —    | Verify the code; creates the user on first use, returns a JWT |
| GET    | `/users/`             | ✔    | Get the current user's email                  |
| GET    | `/tasks/`             | ✔    | List tasks (`?title=` search, `?isDone=true` filter) |
| POST   | `/tasks/`             | ✔    | Create a task (`title`, `description`)        |
| POST   | `/tasks/toggle/:id`   | ✔    | Toggle a task's completed state               |
| DELETE | `/tasks/:id`          | ✔    | Delete a task                                 |

## Key Takeaways

Building the OTP flow meant carefully separating "logged in" (has a valid token) from "in the middle of verifying" (has entered an email but no token yet) across three route-level components — a good exercise in lifting auth state up to the router level in React Router instead of scattering it across pages. On the backend, treating login and signup as a single "verify this code" endpoint removed an entire class of bugs around keeping two separate flows in sync, at the cost of needing to think carefully about OTP expiry and attempt-limiting since it's now the only gate on account creation.
