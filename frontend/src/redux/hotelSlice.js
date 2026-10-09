import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/hotels';

export const fetchHotels = createAsyncThunk('hotels/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API, { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchHotelById = createAsyncThunk('hotels/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createHotel = createAsyncThunk(
  'hotels/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API, formData, {
        timeout: 120000,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          err.message
      );
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // ✅ Headers illa!
      const { data } = await axios.put(`${API}/${id}`, formData, {
        timeout: 120000,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          err.message
      );
    }
  }
);

export const deleteHotel = createAsyncThunk('hotels/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API}/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    list: [],
    total: 0,
    page: 1,
    limit: 6,
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (s) => { s.loading = true; })
      .addCase(fetchHotels.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.limit = a.payload.limit;
      })
      .addCase(fetchHotels.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchHotelById.fulfilled, (s, a) => {
        s.current = a.payload;
      })
      .addCase(deleteHotel.fulfilled, (s, a) => {
        s.list = s.list.filter((h) => h.id !== a.payload);
      });
  },
});

export default hotelSlice.reducer;