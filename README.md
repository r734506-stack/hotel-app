# Hotel App

A full-stack hotel management application with CRUD operations, image upload, search filters, and map integration.

## Tech Stack

**Frontend:**
- React 19 + Vite
- Redux Toolkit
- React Router
- React Helmet (SEO)
- Leaflet (Maps)
- Axios
- React Toastify

**Backend:**
- Node.js + Express
- MySQL (Native SQL, no ORM)
- Multer (Image Upload)
- Express Validator

## Features

- ✅ Add / Edit / Delete hotels
- ✅ Image upload with preview
- ✅ Search by title
- ✅ Filter by price range
- ✅ Pagination (6 per page)
- ✅ Detail page with interactive map
- ✅ SEO optimized (React Helmet)
- ✅ Responsive UI

##  Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=hotel_db
```

Create database:

```sql
CREATE DATABASE hotel_db;
USE hotel_db;

CREATE TABLE hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | Get all hotels (search + pagination) |
| GET | `/api/hotels/:id` | Get single hotel |
| POST | `/api/hotels` | Create hotel |
| PUT | `/api/hotels/:id` | Update hotel |
| DELETE | `/api/hotels/:id` | Delete hotel |

##  Author

**Ragul**
- GitHub: [@r734506-stack](https://github.com/r734506-stack)
