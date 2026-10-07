import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelById } from '../redux/hotelSlice';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const hotel = useSelector((s) => s.hotels.current);

  useEffect(() => { dispatch(fetchHotelById(id)); }, [id]);

  if (!hotel) return <p>Loading...</p>;

  const pos = [parseFloat(hotel.latitude), parseFloat(hotel.longitude)];

  return (
    <>
      <Helmet>
  <title>{hotel.title} - ₹{hotel.price} | HotelApp</title>
  <meta name="description" content={hotel.description.slice(0, 150)} />
  <meta property="og:title" content={hotel.title} />
  <meta property="og:description" content={hotel.description.slice(0, 150)} />
  <meta property="og:image" content={`http://localhost:5000${hotel.image}`} />
</Helmet>

      <div className="detail">
  <img src={`http://localhost:5000${hotel.image}`} alt={hotel.title} ClassName="hero-image" />
  <div className="content">
    <h1>{hotel.title}</h1>
    <p className="price">₹ {hotel.price}</p>
    <p>{hotel.description}</p>
  </div>
  <div className="map-container">
    <MapContainer center={pos} zoom={13} style={{ height: 400, borderRadius: 10 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos}><Popup>{hotel.title}</Popup></Marker>
    </MapContainer>
  </div>
</div>
    </>
  );
}