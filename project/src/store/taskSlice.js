import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`http://localhost:5000/api/tasks?t=${Date.now()}`, { // Add timestamp to bypass cache
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data; // Expect { tasks, users } for managers
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data.task; // Return the created task
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

export const updateTaskAction = createAsyncThunk('tasks/updateTask', async ({ taskId, taskData }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data.task;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTaskAction = createAsyncThunk('tasks/deleteTask', async (taskId, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return taskId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], users: [], status: 'idle', error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newTasks = action.payload.tasks || [];
        // Merge new tasks with existing ones to preserve recent additions
        state.tasks = [...new Set([...state.tasks, ...newTasks].map(t => t._id))].map(id =>
          newTasks.find(t => t._id === id) || state.tasks.find(t => t._id === id)
        );
        state.users = action.payload.users || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.tasks = [];
        state.users = [];
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          const exists = state.tasks.some(t => t._id === action.payload._id);
          if (!exists) {
            state.tasks.push(action.payload); // Add new task only if it doesn’t exist
          }
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTaskAction.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTaskAction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTaskAction.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTaskAction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;