import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';
import type { Task, CreateTaskData, UpdateTaskData, TaskStats } from '../../types/task.types';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  stats: TaskStats | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  stats: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await taskApi.getTasks(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await taskApi.getTaskById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: CreateTaskData, { rejectWithValue }) => {
    try {
      const task = await taskApi.createTask(data);
      toast.success('Task created successfully!');
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const task = await taskApi.updateTask(id, data);
      toast.success('Task updated successfully!');
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(id);
      toast.success('Task deleted successfully!');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const task = await taskApi.updateTaskStatus(id, status);
      toast.success('Status updated!');
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update status');
    }
  }
);

export const updateTaskPriority = createAsyncThunk(
  'tasks/updateTaskPriority',
  async ({ id, priority }: { id: string; priority: string }, { rejectWithValue }) => {
    try {
      const task = await taskApi.updateTaskPriority(id, priority);
      toast.success('Priority updated!');
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update priority');
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchTaskStats',
  async (_, { rejectWithValue }) => {
    try {
      return await taskApi.getTaskStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data.items;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Task By ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Task
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      });

    // Delete Task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    });

    // Update Task Status
    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });

    // Update Task Priority
    builder.addCase(updateTaskPriority.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });

    // Fetch Task Stats
    builder.addCase(fetchTaskStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const { clearError, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;