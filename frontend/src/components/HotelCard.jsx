import { Link } from 'react-router-dom';

export default function HotelCard({ hotel, onDelete }) {
  return (
    <div className="hotel-card">
      <div className="card-image-wrapper">
        <img src={hotel.image} alt={hotel.title} loading="lazy" />
        <span className="rating-badge">⭐ 4.5</span>
      </div>
      <h3>{hotel.title}</h3>
      <p className="price">{hotel.price}</p>
      <p className="desc">{hotel.description.slice(0, 80)}...</p>
      <div className="actions">
        <Link to={`/hotel/${hotel.id}`} className="view-btn">
          View Details
        </Link>
        <Link to={`/edit/${hotel.id}`} className="edit-btn">
          Edit
        </Link>
        <button onClick={() => onDelete(hotel.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}