import { Link } from 'react-router-dom';

export default function HotelCard({ hotel, onDelete }) {
  return (
    <div className="hotel-card">
      <img src={`http://localhost:5000${hotel.image}`} alt={hotel.title} />
      <h3>{hotel.title}</h3>
      <p className="price">₹ {hotel.price}</p>
      <p className="desc">{hotel.description.slice(0, 80)}...</p>
      <div className="actions">
        <Link to={`/hotel/${hotel.id}`}>View</Link>
        <Link to={`/edit/${hotel.id}`}>Edit</Link>
        <button onClick={() => onDelete(hotel.id)}>Delete</button>
      </div>
    </div>
  );
}