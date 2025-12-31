import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';
import type { User } from '../../types/user.types';
import toast from 'react-hot-toast';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await userApi.getUsers(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userApi.getUserById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const user = await userApi.createUser(data);
      toast.success('User created successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create user');
      return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const user = await userApi.updateUser(id, data);
      toast.success('User updated successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user');
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(id);
      toast.success('User deleted successfully!');
      return id;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.items || [];
        state.pagination = action.payload.data?.pagination || null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create User
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.users.unshift(action.payload);
    });

    // Update User
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?._id === action.payload._id) {
        state.currentUser = action.payload;
      }
    });

    // Delete User
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
      if (state.currentUser?._id === action.payload) {
        state.currentUser = null;
      }
    });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
