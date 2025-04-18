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
export const createApplication = createAsyncThunk(
  'application/create',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post('/api/applications', applicationData, getConfig(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to submit application');
    }
  }
);

export const getAllApplications = createAsyncThunk(
  'application/getAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get('/api/applications', getConfig(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'application/updateStatus',
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(`/api/applications/${id}`, { status }, getConfig(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update application status');
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'application/delete',
  async (id, { rejectWithValue, getState }) => {
    try {
      await axios.delete(`/api/applications/${id}`, getConfig(getState));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete application');
    }
  }
);

const initialState = {
  applications: [],
  loading: false,
  error: null,
  success: false,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Applications
      .addCase(getAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Application
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = state.applications.filter((app) => app._id !== action.payload);
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer; 