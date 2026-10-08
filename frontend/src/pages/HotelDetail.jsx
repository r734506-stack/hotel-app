import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelById } from '../redux/hotelSlice';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const hotel = useSelector((s) => s.hotels.current);

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [id, dispatch]);

  if (!hotel) return <p className="center">Loading...</p>;

  const pos = [parseFloat(hotel.latitude), parseFloat(hotel.longitude)];
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <>
      <Helmet>
        <title>
          {hotel.title} - ₹{hotel.price} | HotelApp
        </title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
        <meta property="og:title" content={hotel.title} />
        <meta
          property="og:description"
          content={hotel.description.slice(0, 150)}
        />
        <meta property="og:image" content={`${API_URL}${hotel.image}`} />
        <meta property="og:type" content="place" />
      </Helmet>

      <div className="navbar">
        <div className="brand">🏨 HotelApp</div>
        <div className="nav-right">
          <Link to="/" className="add-btn">
            ← Back to List
          </Link>
        </div>
      </div>

      <div className="detail">
        <img
          src={`${API_URL}${hotel.image}`}
          alt={hotel.title}
          className="hero-image"
        />
        <div className="content">
          <h1>{hotel.title}</h1>
          <p className="price">{hotel.price}</p>
          <p className="description">{hotel.description}</p>
        </div>
        <div className="map-container">
          <MapContainer
            center={pos}
            zoom={13}
            style={{ height: 420, borderRadius: 14 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={pos}>
              <Popup>{hotel.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      <footer className="footer">
        <p>
          🏨 <strong>HotelApp</strong> © 2026 — Built with React + Node.js + PostgreSQL
        </p>
      </footer>
    </>
  );
}