import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchHotels, deleteHotel } from '../redux/hotelSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

export default function HotelList() {
  const dispatch = useDispatch();
  const { list, total, page, limit, loading } = useSelector((s) => s.hotels);

  const [title, setTitle] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const load = (p = 1) => {
    const params = { title, page: p, limit };
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    dispatch(fetchHotels(params));
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line
  }, [title, minPrice, maxPrice]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    const res = await dispatch(deleteHotel(id));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Hotel deleted successfully');
      load(page);
    } else {
      toast.error(res.payload || 'Delete failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Hotels List | HotelApp</title>
        <meta
          name="description"
          content="Browse the best hotels with search, filter, and map view."
        />
      </Helmet>

      <div className="navbar">
        <div className="brand">🏨 Hotel Booking App</div>
        <div className="nav-right">
          <Link to="/add" className="add-btn">
            + Add Hotel
          </Link>
        </div>
      </div>

      <div className="hero">
        <h1>
          Book Your <span> Next Stay</span>
        </h1>
        <p>Discover handpicked hotels across Hyderabad with real-time availability</p>
      </div>

      <div className="filters">
        <input
          placeholder="🔍 Search by title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Min price (₹)"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          placeholder="Max price (₹)"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="grid">
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🏨</div>
              <h3>No hotels found</h3>
              <p>Try changing filters or add a new hotel</p>
            </div>
          ) : (
            list.map((h) => (
              <HotelCard key={h.id} hotel={h} onDelete={handleDelete} />
            ))
          )}
        </div>
      )}

      <Pagination page={page} total={total} limit={limit} onChange={load} />

      <footer className="footer">
        <p>
          🏨 <strong>HotelApp</strong> © 2026 — Built with React + Node.js + PostgreSQL
        </p>
      </footer>
    </>
  );
}