# 🏋️ Gym Management System

A full-stack modern Gym Management System designed to handle gym operations, memberships, trainers, notifications, and client metrics. Built with **React** on the frontend and **Node.js/Express/MongoDB** on the backend.

---

## 📂 Project Structure

```bash
gym_system/
├── backend/
│   ├── config/          # Database configuration and initial database seed scripts
│   ├── controllers/     # Express route handlers
│   ├── middleware/      # Auth and validation middlewares
│   ├── models/          # Mongoose schemas (User, Plan, Notice, etc.)
│   ├── routes/          # Express route declarations
│   ├── .env.example     # Environment template file
│   ├── package.json     # Backend NPM config & scripts
│   └── server.js        # Entrypoint for the backend server
└── frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components (Home, AdminDashboard, TrainerDashboard, etc.)
    │   ├── App.jsx      # Main layout and routing setup
    │   └── main.jsx     # Frontend entrypoint
    ├── package.json     # Frontend NPM config & scripts
    └── vite.config.js   # Vite build/dev tool configuration
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v18+ recommended)
- **MongoDB** (running locally or a MongoDB Atlas URI)
- **Git**

---

### 🔧 Installation & Setup

Follow these steps to run the application locally.

#### 1. Clone the Repository
```bash
git clone https://github.com/Aastik0303/gym_manage.git
cd gym_manage
```

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependecies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update any configuration details inside `.env` if necessary (e.g. database URI, port, secret).
4. Run database seeds (if any):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

The backend server should now be running at `http://localhost:5000`.

---

#### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The application will be accessible at the URL printed in the terminal (typically `http://localhost:5173`).

---

## 🛠️ Built With

### Backend
- **Node.js** & **Express** - Server and API framework
- **MongoDB** & **Mongoose** - Database and object data modeling
- **JWT (JsonWebToken)** - Authentication and authorization
- **Bcrypt.js** - Safe password hashing

### Frontend
- **React 19** - Single Page Application library
- **Vite** - High performance frontend build tool
- **React Router DOM v7** - Declarative routing
- **Lucide React** - High quality SVG icon suite
