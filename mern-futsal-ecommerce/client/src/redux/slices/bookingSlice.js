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
export const createBooking = createAsyncThunk(
  'booking/createBooking',
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
  'booking/fetchBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get('/api/bookings/mybookings', getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const getAllBookings = createAsyncThunk(
  'booking/getAllBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get('/api/bookings', getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch all bookings'
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.put(
        `/api/bookings/${id}`,
        { status },
        getConfig(getState)
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update booking status'
      );
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'booking/deleteBooking',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.delete(`/api/bookings/${id}`, getConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete booking'
      );
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
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
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = [...state.bookings, action.payload];
        state.success = true;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
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
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all bookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
        state.success = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking._id !== action.payload._id
        );
        state.success = true;
        state.error = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearError, clearSuccess } = bookingSlice.actions;
export default bookingSlice.reducer; 