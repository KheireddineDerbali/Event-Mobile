Here’s your content cleanly transformed into a professional **`README.md`** 👇

---

````md
# 📡 Event Backend – Technical API Reference

This document serves as the **ground truth** for any client (Mobile or Web) interacting with the Event Backend.

---

## ⚙️ 1. Global Configuration

- **Base URL:** `http://<server-ip>:<port>`
- **Default Port:** `3001` (as defined in `main.ts`)
- **Content-Type:** `application/json`
- **CORS:** Enabled for all origins

---

## 🔐 2. Authentication Flow

The backend uses **JWT authentication**. Tokens must be included in the `Authorization` header.

### 📌 Authorization Header

```http
Authorization: Bearer <your_jwt_token>
````

---

### 📝 Sign Up (Register)

* **Path:** `/auth/register`
* **Method:** `POST`

#### Request Body

```ts
{
  email: string;    // Must be a valid email
  name: string;     // Minimum length: 2
  password: string; // Minimum length: 6
}
```

#### ✅ Success Response (201)

```json
{
  "accessToken": "eyJhbG..."
}
```

#### ❌ Error (409)

```json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### 🔑 Sign In (Login)

* **Path:** `/auth/login`
* **Method:** `POST`

#### Request Body

```ts
{
  email: string;
  password: string;
}
```

#### ✅ Success Response (200)

```json
{
  "accessToken": "eyJhbG..."
}
```

#### ❌ Error (401)

```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## 📅 3. Events Management

### 📄 List All Events

* **Path:** `/events`
* **Method:** `GET`
* **Auth:** Public

#### ✅ Success Response (200)

```ts
Array<{
  id: string;          // CUID
  title: string;
  description: string | null;
  date: string;        // ISO 8601 Date String
  location: string;
  createdAt: string;
  updatedAt: string;
}>
```

---

### ➕ Create Event

* **Path:** `/events`
* **Method:** `POST`
* **Auth:** Required

#### Request Body

```ts
{
  title: string;
  description?: string;
  date: string; // ISO Date String
  location: string;
}
```

---

### ✏️ Update Event

* **Path:** `/events/:id`

* **Method:** `PATCH`

* **Auth:** Required

* All fields are optional.

---

### ❌ Delete Event

* **Path:** `/events/:id`
* **Method:** `DELETE`
* **Auth:** Required

---

## 🎟️ 4. Event Registration

### 🧾 Register for an Event

* **Path:** `/events/:id/register`
* **Method:** `POST`
* **Auth:** Required

**Description:** Registers the currently authenticated user for the event.

#### ✅ Success Response (201)

```json
{
  "id": "registration_id",
  "userId": "user_id",
  "eventId": "event_id",
  "createdAt": "2024-..."
}
```

#### ❌ Errors

* **404:** Event not found
* **409:** User already registered

---

### 👥 Get Event Participants

* **Path:** `/events/:id/clients`
* **Method:** `GET`
* **Auth:** Required

#### ✅ Success Response (200)

```ts
Array<{
  name: string;
  email: string;
}>
```

---

## ⚠️ 5. Error Handling Patterns

All errors follow the standard **NestJS structure**:

```json
{
  "message": ["error message description"],
  "error": "Bad Request",
  "statusCode": 400
}
```

* `message` can be a string or an array (especially for validation errors)

---

## 🚨 Known Limitation

> ⚠️ **Missing Detail Endpoint**

The backend currently lacks:

```http
GET /events/:id
```

### 🛠 Recommendation

* Option 1: Fetch all events and filter by ID on the client
* Option 2 (recommended): Add a `findOne` endpoint in `EventsController`

---

## 🗄️ 6. Database Schema (Prisma)

| Model            | Fields                                                                     |
| ---------------- | -------------------------------------------------------------------------- |
| **User**         | `id`, `email`, `name`, `password`, `createdAt`                             |
| **Event**        | `id`, `title`, `description`, `date`, `location`, `createdAt`, `updatedAt` |
| **Registration** | `id`, `userId`, `eventId`, `createdAt`                                     |

### 🔒 Constraints

* Unique constraint on: **(userId, eventId)**

---

## ✅ Summary

* JWT-based authentication
* Public and protected endpoints
* Event CRUD + registration system
* Standardized error handling
* Prisma-based schema
