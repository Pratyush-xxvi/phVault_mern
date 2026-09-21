# phVault — Indian Automotive Vault (MERN Stack)

A complete MERN stack (MongoDB, Express, React, Node.js) web application for browsing, purchasing, and managing curated Indian and luxury vehicles in Indian Rupees (₹).

---

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Authentication**: JWT & Role-Based Access Control (`ROLE_ADMIN`, `ROLE_CUSTOMER`)

---

## Project Structure
```
ph_vault_mern/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Auth, Vehicle, Order controllers
│   │   ├── middleware/    # JWT protect & admin role guards
│   │   ├── models/        # Mongoose User, Vehicle, Order schemas
│   │   ├── routes/        # Express API endpoints
│   │   └── seed/          # Initial seed script (12 Indian cars + Admin)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/images/     # Car showcase images
    ├── src/
    │   ├── components/    # Navbar, HeroBanner, FilterBar, Modals, etc.
    │   ├── context/       # AuthContext, ToastContext
    │   ├── services/      # Axios API & Order services
    │   ├── utils/         # Indian Rupee (₹) formatters
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
```
Configure your `.env` file (see `.env.example`):
```env
MONGO_URI=mongodb://localhost:27017/phvault
JWT_SECRET=phvault_super_secret_jwt_key_2024_mern
PORT=5000
CLIENT_URL=http://localhost:5173
```
Seed the initial inventory and default admin account:
```bash
npm run seed
```
Start the backend server:
```bash
npm run dev   # or npm start
```

Default credentials seeded:
- **Admin**: `admin` / `admin123`

---

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
