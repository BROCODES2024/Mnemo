# Mnemo

Mnemo is a full-stack web application built with a **TypeScript + Node.js backend** and a **React (Vite) frontend**.
It helps users manage and share content securely with authentication and role-based access.

🎥 **Demo Video Preview**

[![Watch the demo](https://img.youtube.com/vi/nCBQL174EmM/0.jpg)](https://youtu.be/nCBQL174EmM)

---

## 🚀 Features

- 🔐 Authentication & protected routes
- 📦 Content management (add, view, share)
- 🌐 Public & private routes with access control
- 🎨 Modern UI powered by [shadcn/ui](https://ui.shadcn.com) & TailwindCSS
- ⚡ Built with TypeScript for type safety

---

## 📂 Project Structure

```
Mnemo
├─ backend        # Node.js + Express + MongoDB (TypeScript)
│  ├─ src         # Source code
│  ├─ dist        # Compiled JS
│  ├─ .env        # Environment variables (create from .env.example)
│  └─ tsconfig.json
│
├─ frontend       # React + Vite + Tailwind + shadcn/ui
│  ├─ src         # Components, pages, store, utils
│  ├─ public      # Static assets
│  └─ vite.config.ts
│
└─ README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mnemo.git
cd mnemo
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # configure environment variables
npm start
```

Backend runs at: **[http://localhost:3000](http://localhost:3000)**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Environment Variables

The backend requires a `.env` file. Use the provided `.env.example` as a reference.

```ini
# Server
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/mnemo

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
```

> ⚠️ Never commit your real `.env` file to GitHub. Only share `.env.example`.

---

## 🛠 Tech Stack

**Backend:**

- Node.js, Express, TypeScript
- MongoDB (Mongoose)
- JWT Authentication

**Frontend:**

- React (Vite + TypeScript)
- TailwindCSS + shadcn/ui
- Zustand for state management
- React Router v6

---

## 📜 License

This project is licensed under the MIT License.

---
