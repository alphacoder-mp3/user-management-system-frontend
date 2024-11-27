import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState } from '../../types';

const initialState: UsersState = {
  users: [],
  loading: false,
  operationLoading: {
    create: false,
    update: null,
    delete: null,
  },
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        user => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCreateLoading: (state, action: PayloadAction<boolean>) => {
      state.operationLoading.create = action.payload;
    },
    setUpdateLoading: (state, action: PayloadAction<string | null>) => {
      state.operationLoading.update = action.payload;
    },
    setDeleteLoading: (state, action: PayloadAction<string | null>) => {
      state.operationLoading.delete = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
