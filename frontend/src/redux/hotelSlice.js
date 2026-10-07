import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/hotels';

export const fetchHotels = createAsyncThunk('hotels/fetch', async (params) => {
  const { data } = await axios.get(API, { params });
  return data;
});

export const fetchHotelById = createAsyncThunk('hotels/fetchOne', async (id) => {
  const { data } = await axios.get(`${API}/${id}`);
  return data;
});

export const createHotel = createAsyncThunk('hotels/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(API, formData);
    return data;
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message
    );
  }
});

export const updateHotel = createAsyncThunk('hotels/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${API}/${id}`, formData);
    return data;
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message
    );
  }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id) => {
  await axios.delete(`${API}/${id}`);
  return id;
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    list: [], total: 0, page: 1, limit: 6,
    current: null, loading: false, error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchHotels.pending, (s) => { s.loading = true; })
      .addCase(fetchHotels.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.limit = a.payload.limit;
      })
      .addCase(fetchHotels.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchHotelById.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(deleteHotel.fulfilled, (s, a) => {
        s.list = s.list.filter((h) => h.id !== a.payload);
      });
  },
});

export default hotelSlice.reducer;