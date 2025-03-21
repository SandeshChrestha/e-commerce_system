import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configure axios baseURL
axios.defaults.baseURL = 'http://localhost:5000';

// Helper function to get auth config
const getConfig = (getState) => {
  const { user } = getState().auth;
  
  if (!user) {
    throw new Error('Please login first');
  }

  if (!user.token) {
    throw new Error('Authentication token not found');
  }

  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
  };
};

// Async thunks
export const fetchCourts = createAsyncThunk(
  'futsalCourt/fetchCourts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get('/api/futsal-courts', getConfig(getState));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch courts'
      );
    }
  }
);

export const createCourt = createAsyncThunk(
  'futsalCourt/createCourt',
  async (courtData, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.post('/api/futsal-courts', courtData, getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create court'
      );
    }
  }
);

export const updateCourt = createAsyncThunk(
  'futsalCourt/updateCourt',
  async ({ id, courtData }, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.put(`/api/futsal-courts/${id}`, courtData, getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update court'
      );
    }
  }
);

export const deleteCourt = createAsyncThunk(
  'futsalCourt/deleteCourt',
  async (id, { rejectWithValue, getState }) => {
    try {
      await axios.delete(`/api/futsal-courts/${id}`, getConfig(getState));
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete court'
      );
    }
  }
);

// Booking thunks
export const createBooking = createAsyncThunk(
  'futsalCourt/createBooking',
  async (bookingData, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.post('/api/bookings', bookingData, getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create booking'
      );
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'futsalCourt/fetchBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get('/api/bookings', getConfig(getState));
      return Array.isArray(data) ? data : data.bookings || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch bookings'
      );
    }
  }
);

const futsalCourtSlice = createSlice({
  name: 'futsalCourt',
  initialState: {
    courts: [],
    bookings: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courts
      .addCase(fetchCourts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourts.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = action.payload;
        state.error = null;
      })
      .addCase(fetchCourts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create court
      .addCase(createCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = [...state.courts, action.payload];
        state.success = true;
        state.error = null;
      })
      .addCase(createCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update court
      .addCase(updateCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = state.courts.map((court) =>
          court._id === action.payload._id ? action.payload : court
        );
        state.success = true;
        state.error = null;
      })
      .addCase(updateCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete court
      .addCase(deleteCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = state.courts.filter((court) => court._id !== action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(deleteCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookings = [];
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = Array.isArray(state.bookings) 
          ? [...state.bookings, action.payload]
          : [action.payload];
        state.success = true;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = futsalCourtSlice.actions;
export default futsalCourtSlice.reducer; 