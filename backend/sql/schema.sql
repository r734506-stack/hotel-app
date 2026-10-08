-- PostgreSQL Schema for Hotel App

CREATE TABLE IF NOT EXISTS hotels (
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

-- Indexes for faster search
CREATE INDEX IF NOT EXISTS idx_title ON hotels(title);
CREATE INDEX IF NOT EXISTS idx_price ON hotels(price);
