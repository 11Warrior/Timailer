
# 📧 Email Scheduler Service

A production-grade email scheduling system built using **Node.js**, **BullMQ**, **Redis**, **PostgreSQL**, and **Ethereal Email**.

This service allows users to schedule emails for a future time, processes them reliably using delayed jobs (no cron), survives restarts, and enforces real-world constraints like rate limiting and throttling.

---

## 🚀 Features

* Schedule emails via REST APIs
* Persistent delayed job scheduling using **BullMQ + Redis**
* ❌ No cron jobs (strictly enforced)
* Restart-safe processing (server & worker)
* Fake SMTP delivery using **Ethereal Email**
* Worker concurrency and throttling
* Per-sender rate limiting (emails per hour)
* Idempotent processing (no duplicate emails)
* Dashboard-friendly email status tracking

---

## 🏗️ Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Backend         | Node.js, Express        |
| Queue           | BullMQ                  |
| Scheduler Store | Redis                   |
| Database        | PostgreSQL (Prisma ORM) |
| Email           | Nodemailer + Ethereal   |
| Worker          | BullMQ Worker           |
| Language        | TypeScript              |

---

## 🏗️ Working Demo

https://github.com/user-attachments/assets/8e8371dd-f1fc-45ef-8269-39dda6b8ffa9

## ⚙️ Project Setup and Installations

This project requires **Redis**, **PostgreSQL**, and environment variables for both **backend** and **worker**.

---

### 📄 Backend Environment Variables

Create a `.env` file inside the **Backend/** directory.

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=your postgress connection url that you got from Prisma console

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=5555

# Worker Configuration
CONCURRENCY=5             # jobs handling in parallel
DELAY=1000                 # Delay between email sends (ms)
MAX_EMAILS_PER_HOUR=200    # Per-sender rate limit

# Auth / App (if applicable)
JWT_SECRET=your_secret_key
OAUTH_CLIENT_ID= your oauth client id from google console
OAUTH_CLIENT_SECRET=your client secret from google console

```

📌 **Notes**

* `DELAY` controls throttling (used for demo)
* Redis **must stay running** for delayed jobs
* PostgreSQL is used for persistent email state

---

## 🧱 Backend Setup & Run

### 1️⃣ Install Dependencies

```bash
cd Backend
npm install
```

---

### 2️⃣ Start Redis

```bash
redis-server --port 5555
```

Verify Redis is running:

```bash
redis-cli -p 5555 ping
# PONG
```

---

### 3️⃣ Run Database Migrations

```bash
npx prisma migrate dev
```

(Optional)

```bash
npx prisma studio
```

---

### 4️⃣ Start Backend API Server

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3000
```

---

### 5️⃣ Start Worker (Required)

Open a **new terminal**:

```bash
cd Backend
npm run worker
```

📌 The worker:

* Consumes delayed jobs
* Sends emails
* Applies rate limiting and throttling

---

## 🎨 Frontend Setup & Run

### 1️⃣ Install Dependencies

```bash
cd Frontend
npm install
```

---

### 2️⃣ Frontend Environment Variables

Create `.env` in **Frontend/**:

```env
VITE_BACKEND_URL=http://localhost:3000 or your backend base endpoint
```

📌 Frontend uses **Vite**, so variables must start with `VITE_`.

---

### 3️⃣ Start Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173 generally, you may have it on differnt port in case of busy.
```

---

## 🔁 Required Services Summary

| Service     | Required | Notes                     |
| ----------- | -------- | ------------------------- |
| Redis       | ✅        | Must stay running         |
| PostgreSQL  | ✅        | Stores email records      |
| Backend API | ✅        | Accepts schedule requests |
| Worker      | ✅        | Sends emails              |
| Frontend    | Optional | UI & dashboard            |

---

## 🧪 Quick Verification Checklist

Before running the demo, ensure:

* ✅ Redis is running
* ✅ Database migrations applied
* ✅ Backend server running
* ✅ Worker running in separate terminal
* ✅ Frontend connected to backend

---

## ⚠️ Common Issues

* **Emails not sending** → Worker not running
* **Scheduled emails lost** → Redis stopped
* **No dashboard updates** → Backend not connected to DB
* **Env variables not loading** → Restart server after `.env` change

---

## 🧭 Architecture Overview

```
Client / Dashboard
        |
        v
REST API (Express)
        |
        v
PostgreSQL (Email Records)
        |
        v
BullMQ Queue (Delayed Jobs)
        |
        v
Redis (Persistence)
        |
        v
Worker Process
        |
        v
Ethereal Fake SMTP
```

---

## 📬 Email Lifecycle

```
Scheduled → Sending → Sent
               ↘
               Failed
```

* **Scheduled** – Email stored in DB and queued
* **Sending** – Worker atomically claims the email
* **Sent** – SMTP send successful
* **Failed** – SMTP/network error

---

## 🔌 API

### Schedule an Email

**POST** `/emails/schedule`

```json
{
  "userId": "uuid",
  "senderEmail": "test@ethereal.email",
  "receiverEmail": ["user@gmail.com"],
  "subject": "Hello",
  "body": "Test email",
  "scheduledAt": "2026-01-20T07:03:00.000Z"
}
```

### Behavior

* Persists email in database
* Enqueues a **BullMQ delayed job**
* Returns immediately (async processing)

---

## ⏱️ Scheduling (No Cron)

* ❌ No OS cron
* ❌ No `node-cron`
* ✅ Uses **BullMQ delayed jobs**

```ts
queue.add("send-email", { id }, { delay });
```

* Jobs are stored in Redis
* Scheduling survives server & worker restarts

---

## 🔁 Idempotency & Restart Safety

Emails are **atomically claimed** before sending:

```sql
UPDATE email
SET status = 'Sending'
WHERE id = ? AND status = 'Scheduled';
```

This guarantees:

* No duplicate emails
* Safe parallel workers
* Correct behavior after crashes/restarts

---

## ⚙️ Worker Concurrency

Configured via environment variable:

```env
CONCURRENCY=5
```

```ts
new Worker("email-queue", processor, {
  concurrency: CONCURRENCY
});
```

---

## 🚦 Rate Limiting (Emails per Hour)

```env
MAX_EMAILS_PER_HOUR=200
```

* Implemented using Redis counters
* Key format:

```
rate:<senderEmail>:<hour>
```

### When limit is exceeded

* Email is delayed to the next hour window
* Jobs are never dropped
* Order preserved as much as possible

---

## ⏳ Throttling (Delay Between Sends)

```env
DELAY=1000
```

```ts
limiter: {
  max: 1,
  duration: DELAY
}
```

Simulates real SMTP provider throttling.

---

## 📤 Email Delivery (Ethereal)

This project uses **Ethereal Email**, a fake SMTP provider.

* Emails are **not delivered to real inboxes**
* Messages are captured for inspection
* Safe for development and testing

### Implementation Detail

Uses **Nodemailer test accounts**:

```ts
const testAccount = await nodemailer.createTestAccount();
```

This approach:

* Works on restricted networks
* Avoids SMTP port blocking
* Provides preview URLs

Example log:

```
Preview URL: https://ethereal.email/message/XXXXX
```

---

## 🧪 Testing the Scheduler

### Quick Test (2–3 minutes from now)

```ts
new Date(Date.now() + 2 * 60 * 1000).toISOString();
```

Expected flow:

1. Email → Scheduled
2. Worker triggers after delay
3. Status → Sent
4. Preview URL logged

---

## 🛠️ Environment Variables

```env
CONCURRENCY=5
MAX_EMAILS_PER_HOUR=200
DELAY=1000
REDIS_PORT=5555
```

---

## ▶️ Running the Project

### Start Redis

```bash
redis-server --port 5555
```

### Start API Server

```bash
npm run dev
```

### Start Worker (separate terminal)

```bash
npm run worker
```

---

## 📋 Hard Constraints Compliance

| Requirement            | Status |
| ---------------------- | ------ |
| No cron jobs           | ✅      |
| Persistent scheduling  | ✅      |
| Redis-backed scheduler | ✅      |
| Restart safe           | ✅      |
| No duplicate emails    | ✅      |
| Rate limiting          | ✅      |
| Worker concurrency     | ✅      |
| Fake SMTP (Ethereal)   | ✅      |

---

## 🧠 Notes for Reviewers

* Emails are marked **Sent only after SMTP success**
* Failed emails are safely marked **Failed**
* No in-memory scheduling or cron usage
* Architecture mirrors real-world email systems

---

## ✅ Conclusion
