# EventHub - Event Booking Platform

A full-stack modern MERN (MongoDB, Express, React, Node.js) platform for discovering, creating, and booking events.

## Project Structure

```
EventHub/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── uploads/
│   │   ├── socket/
│   │   ├── emails/
│   │   ├── validations/
│   │   ├── constants/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── constants/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md
└── package.json
```

## Quick Start

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Phases
- [x] **Phase 1:** Project Setup (Architecture, dependencies, routing, styles, error handling)
- [ ] **Phase 2:** Authentication & Database Schema
- [ ] **Phase 3:** Event Management APIs
- [ ] **Phase 4:** Ticket Booking & Payment Integration
- [ ] **Phase 5:** QR Code Ticket Generation & Seat Selection
- [ ] **Phase 6:** Real-time Notifications & Chat (Socket.io)
