# 🏨 Hotel App

A full-stack hotel management application with CRUD operations, image upload, search filters, and interactive map integration.

## 🌐 Live Demo

- **Frontend:** [hotelbookapplication.netlify.app](https://hotelbookapplication.netlify.app)
- **Backend API:** [hotel-app-backend-vhsu.onrender.com/api/hotels](https://hotel-app-backend-vhsu.onrender.com/api/hotels)

## 🚀 Tech Stack

### Frontend
- **React 19** + Vite
- **Redux Toolkit** (State management)
- **React Router** (SPA routing)
- **React Helmet** (SEO meta tags)
- **Leaflet** (Interactive maps)
- **Axios** (API calls)
- **React Toastify** (Notifications)

### Backend
- **Node.js** + Express
- **PostgreSQL** (Native SQL queries, no ORM)
- **Multer** (Image upload)
- **Express Validator** (Input validation)
- **pg** (PostgreSQL client)

### Deployment
- **Render** (Backend + Database)
- **Netlify** (Frontend)

## ✨ Features

- ✅ Add / Edit / Delete hotels (CRUD)
- ✅ Image upload with preview
- ✅ Search by title
- ✅ Filter by price range
- ✅ Pagination (6 per page)
- ✅ Detail page with interactive map
- ✅ SEO optimized (React Helmet)
- ✅ Fully responsive UI
- ✅ Loading skeletons
- ✅ Toast notifications

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=hotel_db
DB_PORT=5432
```

Create database:

```sql
CREATE DATABASE hotel_db;
```

Run migrations (schema):

```bash
psql -U postgres -d hotel_db -f sql/schema.sql
```

Start server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | List hotels (with search, filter, pagination) |
| GET | `/api/hotels/:id` | Get single hotel |
| POST | `/api/hotels` | Create hotel (multipart/form-data) |
| PUT | `/api/hotels/:id` | Update hotel |
| DELETE | `/api/hotels/:id` | Delete hotel + image |

### Query Parameters (GET `/api/hotels`)
- `title` — Search by title (partial match)
- `minPrice` — Minimum price
- `maxPrice` — Maximum price
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 6)

## 🗄️ Database Schema

```sql
CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Project Structure

```
hotel-app/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Upload + validation
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded images
│   ├── sql/            # Schema
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── redux/      # State management
    │   └── App.jsx
    └── package.json
```

## 👤 Author

**Ragul**
- GitHub: [@r734506-stack](https://github.com/r734506-stack)

## 📄 License

MIT License