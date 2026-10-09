# 🎟️ Event Planner

A campus event management web app with three roles: **Student**, **Organizer** and **Admin**. Students discover events and get QR passes, organizers publish events and check people in at the door, and admins keep everything trustworthy.

Built with **Node.js, Express, MongoDB (Atlas) and JWT authentication**, with a lightweight vanilla JavaScript front end (no build step).

## Workflow

```
        [ Student / Organizer / Admin ]
                      │
        Authentication (JWT, email + password)
                      │
     ┌────────────────┼──────────────────┐
  [Student]       [Organizer]          [Admin]
  Browse Feed     Create Event         Approve Events
  Register        Publish              Verify Clubs
  Get QR Pass     Scan QR              View Analytics
                      │
          Database & Analytics (MongoDB)
```

## Features

| Role | What they can do |
|------|------------------|
| **Student** | Browse and search the event feed, register (capacity is enforced), get a personal QR pass, cancel a registration |
| **Organizer** | Create and edit draft events, publish them for approval, view attendees, scan QR passes (camera or pasted code) |
| **Admin** | Approve or reject events (with a reason), verify clubs, view analytics: users, events, registrations, attendance rate, top events |

### How an event moves

`draft` → organizer clicks **Publish** → `pending` → admin **Approves** → `approved` (shown in the student feed)

An admin can also **reject** an event with a reason; the organizer can edit it and publish again. Organizers can only publish once an admin has **verified their club**.

## Tech stack

- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT (7-day sessions), bcrypt password hashing, role-based access
- **QR codes:** `qrcode` (generation) and `html5-qrcode` (camera scanning)
- **Frontend:** HTML, CSS and vanilla JS, with light and dark mode

## Project structure

```
event-planner/
├── server.js              # App entry point and MongoDB connection
├── middleware/auth.js     # JWT check + role guard
├── models/                # User, Club, Event, Registration
├── routes/
│   ├── auth.js            # Sign up, log in, current user
│   ├── events.js          # Student: feed, register, QR passes
│   ├── organizer.js       # Organizer: events, publish, scan
│   └── admin.js           # Admin: approvals, clubs, analytics
├── scripts/seed.js        # Creates the first admin
├── public/                # Front end (index.html, app.js, style.css)
└── .env.example           # Environment variable template
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas cluster. In Atlas, click **Connect → Drivers** to copy your connection string, and add your IP under **Network Access**.

### Installation

```bash
git clone https://github.com/<your-username>/event-planner.git
cd event-planner
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/event-planner?retryWrites=true&w=majority
JWT_SECRET=a-long-random-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

### Create the first admin

Admins cannot sign up from the public form:

```bash
npm run seed
```

### Run

```bash
npm start        # production
npm run dev      # auto-restart on changes
```

Open **http://localhost:3000**.

## Try the whole flow

1. Sign up as an **Organizer** with a club name and create a draft event.
2. Log in as the **admin**, open *Verify Clubs* and verify that club.
3. As the organizer, click **Publish**. As the admin, open *Approve Events* and approve it.
4. Sign up as a **Student**, register for the event, and open *My QR Passes*.
5. As the organizer, open *Scan QR* and scan the pass (or paste the ticket code). Scanning the same pass twice is rejected.

> The camera scanner requires HTTPS or `localhost`.

## API reference

All routes except sign up and log in need the header `Authorization: Bearer <token>`.

**Auth**

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Sign up as student or organizer (organizers include `clubName`) |
| POST | `/api/auth/login` | Log in and receive a token |
| GET | `/api/auth/me` | Current user |

**Student**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/events?search=&category=` | Approved upcoming events |
| POST | `/api/events/:id/register` | Register for an event |
| DELETE | `/api/events/:id/register` | Cancel a registration |
| GET | `/api/events/my/registrations` | My QR passes |

**Organizer**

| Method | Route | Description |
|--------|-------|-------------|
| GET / POST | `/api/organizer/events` | List or create my events |
| PUT | `/api/organizer/events/:id` | Edit a draft or rejected event |
| POST | `/api/organizer/events/:id/publish` | Submit for approval |
| GET | `/api/organizer/events/:id/attendees` | Attendee list |
| POST | `/api/organizer/scan` | Check in a QR pass (`{ token }`) |

**Admin**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/events?status=pending` | Events by status |
| POST | `/api/admin/events/:id/approve` | Approve an event |
| POST | `/api/admin/events/:id/reject` | Reject with `{ reason }` |
| GET | `/api/admin/clubs` | All clubs |
| POST | `/api/admin/clubs/:id/verify` | Verify or revoke (`{ verified }`) |
| GET | `/api/admin/analytics` | Platform statistics |

## Security notes

- Passwords are hashed with bcrypt, and sessions use signed JWTs.
- Every role-specific route is protected on the server, not just hidden in the UI.
- QR passes carry a random 48-character token, not user data.
- Never commit your `.env` file (it is already in `.gitignore`). If your Atlas password is ever exposed, rotate it.

## Roadmap

- OAuth2 sign-in (for example Google) using `passport-google-oauth20`
- Email confirmations and reminders
- Event images and a calendar view

## License

MIT
