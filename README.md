<div align="center">

# 🎟️ Event Pro

**A full-stack event management platform** — NestJS REST API + React Native (Expo) mobile app

[![Backend](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)](https://github.com/KheireddineDerbali/Event-Web-Application)
[![Mobile](https://img.shields.io/badge/Mobile-Expo%20%2F%20React%20Native-000020?logo=expo)](https://github.com/KheireddineDerbali/Event-Mobile)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

</div>

---

## 📐 Project Overview

Event Pro is a full-stack event management system composed of two independent parts:

| Part | Technology | Repository |
|------|-----------|------------|
| **Backend API** | NestJS · Prisma · PostgreSQL · JWT | [Event-Web-Application / event-backend](https://github.com/KheireddineDerbali/Event-Web-Application/tree/main/event-backend) |
| **Mobile App** | Expo · React Native · TypeScript · Zustand · TanStack Query | [Event-Mobile](https://github.com/KheireddineDerbali/Event-Mobile) |

### ✨ Features

- 🔐 JWT Authentication (Sign Up / Sign In)
- 📅 Full Event CRUD (Create, List, Edit, Delete)
- 🎟️ Event Registration per user
- 🌍 Multilingual UI (English · Français · العربية + RTL)
- 🌙 Dark / Light mode with persistence
- 📸 Cover photo picker
- 🧭 Glassmorphic Bottom Navigation

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <img src="screens/login.png" width="220" alt="Login Screen" /><br/>
      <b>🔐 Login</b><br/>
      <sub>Brand hero with ✦ badge, focus-glow inputs,<br/>blue CTA with haptic feedback</sub>
    </td>
    <td align="center">
      <img src="screens/eventlist.png" width="220" alt="Events List Screen" /><br/>
      <b>🗓️ Events List</b><br/>
      <sub>Date-badge cards, event count, glassmorphic<br/>Tab Bar with active dot indicator</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screens/newevent.png" width="220" alt="Create Event Screen" /><br/>
      <b>➕ Create Event</b><br/>
      <sub>Bento-grid layout, cover photo picker,<br/>Pressable tile selectors for date, time & location</sub>
    </td>
    <td align="center">
      <img src="screens/profilseting.png" width="220" alt="Profile & Settings Screen" /><br/>
      <b>👤 Profile & Settings</b><br/>
      <sub>Dark mode toggle, language switcher<br/>(EN · FR · AR), Pro member badge</sub>
    </td>
  </tr>
</table>

---

## 🗂️ Repository Structure

```
Event-Web-Application/
└── event-backend/        ← NestJS API (port 3001)

Event-Mobile/
└── eventpro/             ← Expo React Native app
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **npm** v9+
- **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- A **PostgreSQL** database or [Neon DB](https://neon.tech) cloud instance

---

## 🖥️ Part 1 — Backend (NestJS)

### 1. Clone the repository

```bash
git clone https://github.com/KheireddineDerbali/Event-Web-Application.git
cd Event-Web-Application/event-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in `event-backend/`:

```env
DATABASE_URL="postgresql://user:password@host/dbname"
JWT_SECRET="your-random-secret-key"
PORT=3001
```

> 💡 If using [Neon DB](https://neon.tech), copy the connection string from the Neon dashboard.

### 4. Generate Prisma client & run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run start:dev
```

✅ The API will be running at **`http://localhost:3001`**

---

## 📱 Part 2 — Mobile App (Expo)

### 1. Clone the repository

```bash
git clone https://github.com/KheireddineDerbali/Event-Mobile.git
cd Event-Mobile/eventpro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Find your local IP address (Windows)

> ⚠️ Your phone and PC must be on the **same Wi-Fi or Ethernet network.**
> Expo Go connects to your backend via your machine's local IP, **not** `localhost`.

Open **Command Prompt** or **PowerShell** and run:

```powershell
ipconfig
```

Look for the section matching your active connection (Wi-Fi or Ethernet):

```
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . . : 192.168.1.15   ← use this
```

In this project the active IP is **`192.168.1.15`**.

### 4. Configure environment variables

Create a `.env` file in `eventpro/`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.15:3001
```

> ⚠️ Replace `192.168.1.15` with **your own IPv4 address** from the `ipconfig` output above.
> Do **not** use `localhost` — it will not be reachable from your physical device.

### 5. Start the Expo dev server

```bash
npx expo start -c
```

The `-c` flag clears Metro's cache (recommended after adding new packages).

### 6. Open on your device

- **Expo Go (physical device):** Scan the QR code shown in the terminal
- **Android emulator:** Press `a`
- **iOS simulator:** Press `i` (macOS only)

---

## 🔑 API Endpoints Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | ❌ | Create a new account |
| `POST` | `/auth/login` | ❌ | Sign in, receive JWT |
| `GET` | `/events` | ❌ | List all events |
| `POST` | `/events` | ✅ | Create an event |
| `PATCH` | `/events/:id` | ✅ | Update an event |
| `DELETE` | `/events/:id` | ✅ | Delete an event |
| `POST` | `/events/:id/register` | ✅ | Register for an event |
| `GET` | `/events/:id/clients` | ✅ | List event participants |

---

## 🧑‍💻 Tech Stack

### Backend
- [NestJS](https://nestjs.com/) — Node.js framework
- [Prisma](https://www.prisma.io/) — ORM
- [PostgreSQL](https://www.postgresql.org/) / [Neon DB](https://neon.tech)
- JWT via `@nestjs/jwt`

### Mobile
- [Expo](https://expo.dev/) (SDK 54, Managed Workflow)
- [React Native](https://reactnative.dev/) with TypeScript
- [React Navigation](https://reactnavigation.org/) (Native Stack + Bottom Tabs)
- [TanStack Query](https://tanstack.com/query) — Server state
- [Zustand](https://zustand-demo.pmnd.rs/) — Client state
- [Lucide React Native](https://lucide.dev/) — Icons
- [NativeWind](https://www.nativewind.dev/) — Tailwind for RN
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) — Token storage

---

## 📝 License

MIT © [KheireddineDerbali](https://github.com/KheireddineDerbali)
