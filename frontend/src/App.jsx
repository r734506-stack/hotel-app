import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import AddEditHotel from './pages/AddEditHotel';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HotelList />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/add" element={<AddEditHotel />} />
          <Route path="/edit/:id" element={<AddEditHotel />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </HelmetProvider>
  );
}