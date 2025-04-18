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
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/futsal-courts');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch courts'
      );
    }
  }
);

export const getFutsalCourtById = createAsyncThunk(
  'futsalCourt/getFutsalCourtById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get(`/api/futsal-courts/${id}`, getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch court details'
      );
    }
  }
);

export const createFutsalCourt = createAsyncThunk(
  'futsalCourt/createFutsalCourt',
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

export const updateFutsalCourt = createAsyncThunk(
  'futsalCourt/updateFutsalCourt',
  async ({ id, ...courtData }, { rejectWithValue, getState }) => {
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

export const deleteFutsalCourt = createAsyncThunk(
  'futsalCourt/deleteFutsalCourt',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.delete(`/api/futsal-courts/${id}`, getConfig(getState));
      return data;
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
      const { data } = await axios.get('/api/bookings/mybookings', getConfig(getState));
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
    court: null,
    bookings: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
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
      // Get court by ID
      .addCase(getFutsalCourtById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFutsalCourtById.fulfilled, (state, action) => {
        state.loading = false;
        state.court = action.payload;
        state.error = null;
      })
      .addCase(getFutsalCourtById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create court
      .addCase(createFutsalCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFutsalCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = [...state.courts, action.payload];
        state.success = true;
        state.error = null;
      })
      .addCase(createFutsalCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update court
      .addCase(updateFutsalCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFutsalCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = state.courts.map((court) =>
          court._id === action.payload._id ? action.payload : court
        );
        state.court = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateFutsalCourt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete court
      .addCase(deleteFutsalCourt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFutsalCourt.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = state.courts.filter(
          (court) => court._id !== action.payload._id
        );
        state.court = null;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteFutsalCourt.rejected, (state, action) => {
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

export const { reset, clearError, clearSuccess } = futsalCourtSlice.actions;
export default futsalCourtSlice.reducer; 