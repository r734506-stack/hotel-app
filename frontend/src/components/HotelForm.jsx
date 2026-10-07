import { useState, useEffect } from 'react';

export default function HotelForm({ initial, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: '', description: '', latitude: '', longitude: '', price: '', image: null,
  });
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({ ...initial, image: null });
      setPreview(initial.image ? `http://localhost:5000${initial.image}` : '');
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.description.trim()) e.description = 'Description required';
    if (!form.latitude || form.latitude < -90 || form.latitude > 90) e.latitude = 'Valid latitude required';
    if (!form.longitude || form.longitude < -180 || form.longitude > 180) e.longitude = 'Valid longitude required';
    if (!form.price || form.price <= 0) e.price = 'Valid price required';
    if (!initial && !form.image) e.image = 'Image required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k] !== null) fd.append(k, form[k]);
    });
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="hotel-form">
      <div>
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImage} />
        {errors.image && <span className="err">{errors.image}</span>}
        {preview && <img src={preview} alt="preview" width="180" />}
      </div>

      <div>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
        {errors.title && <span className="err">{errors.title}</span>}
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
        {errors.description && <span className="err">{errors.description}</span>}
      </div>

      <div className="row">
        <div>
          <label>Latitude</label>
          <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} />
          {errors.latitude && <span className="err">{errors.latitude}</span>}
        </div>
        <div>
          <label>Longitude</label>
          <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} />
          {errors.longitude && <span className="err">{errors.longitude}</span>}
        </div>
      </div>

      <div>
        <label>Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} />
        {errors.price && <span className="err">{errors.price}</span>}
      </div>

      <button disabled={submitting}>{initial ? 'Update' : 'Create'}</button>
    </form>
  );
}