import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createHotel, updateHotel, fetchHotelById } from '../redux/hotelSlice';
import HotelForm from '../components/HotelForm';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async'; // ✅ Ithu venum

export default function AddEditHotel() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const current = useSelector((s) => s.hotels.current);

  useEffect(() => {
    if (id) dispatch(fetchHotelById(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    let res;
    if (id) {
      res = await dispatch(updateHotel({ id, formData }));
    } else {
      res = await dispatch(createHotel(formData));
    }

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(id ? 'Hotel updated' : 'Hotel created');
      nav('/');
    } else {
      toast.error(res.payload || 'Something went wrong');
    }
  };

  const pageTitle = id
    ? (current?.title ? `✏️ Editing: ${current.title}` : '✏️ Edit Hotel')
    : '➕ Add New Hotel';

  return (
    <>
      <Helmet>
        <title>{pageTitle} | HotelApp</title>
        <meta name="description" content={id ? `Edit ${current?.title || 'hotel'} details` : 'Add a new hotel'} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="page-header">
        <h1>{pageTitle}</h1>
        <p>{id ? 'Update hotel information' : 'Fill in the details to add a new hotel'}</p>
      </div>

      <HotelForm initial={id ? current : null} onSubmit={handleSubmit} />
    </>
  );
}