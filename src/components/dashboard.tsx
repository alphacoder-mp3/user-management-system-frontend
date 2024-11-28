import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import { LogOut, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { logout } from '../store/slices/auth-slice';
import {
  setUsers,
  setPagination,
  updateUser,
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
} from '../store/slices/user-slice';
import type { RootState } from '../store/store';
import UserModal from './user-modal';
import UserTable from './user-table';
import Pagination from './pagination';
import ConfirmDialog from './confirm-dialog';
import { apiRequest } from '../utils/api';
import { User, UserModalData, PaginatedResponse } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { users, loading, operationLoading, pagination } = useSelector(
    (state: RootState) => state.users
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserModalData | undefined>(
    undefined
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    userId: string | null;
  }>({
    open: false,
    userId: null,
  });

  const fetchUsers = useCallback(
    async (page: number = 1) => {
      try {
        dispatch(setLoading(true));
        const { data, error } = await apiRequest<PaginatedResponse<User>>(
          `/api/users?page=${page}&limit=${pagination.pageSize}`,
          undefined,
          token as string
        );

        if (error) return;
        if (data) {
          dispatch(setUsers(data.users));
          dispatch(setPagination(data.pagination));
        }
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, token, pagination.pageSize]
  );

  useEffect(() => {
    if (token) {
      fetchUsers(pagination.currentPage);
    }
  }, [fetchUsers, token, pagination.currentPage]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleAddUser = async (data: UserModalData) => {
    try {
      dispatch(setCreateLoading(true));
      const { data: newUser, error } = await apiRequest<User>(
        '/api/users',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        token as string
      );

      if (error) return;
      if (newUser) {
        await fetchUsers(1); // Refresh the first page after adding
        toast.success('User added successfully');
        setIsModalOpen(false);
      }
    } finally {
      dispatch(setCreateLoading(false));
    }
  };

  const handleEditUser = async (data: UserModalData) => {
    if (!selectedUser?.id) return;

    try {
      dispatch(setUpdateLoading(selectedUser.id));
      const { data: updatedUser, error } = await apiRequest<User>(
        `/api/users/${selectedUser.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        },
        token as string
      );

      if (error) return;
      if (updatedUser) {
        dispatch(updateUser(updatedUser));
        toast.success('User updated successfully');
        setIsModalOpen(false);
        setSelectedUser(undefined);
      }
    } finally {
      dispatch(setUpdateLoading(null));
    }
  };

  const handleDeleteConfirm = (userId: string) => {
    setDeleteConfirm({ open: true, userId });
  };

  const handleDeleteUser = async () => {
    const userId = deleteConfirm.userId;
    if (!userId) return;

    try {
      dispatch(setDeleteLoading(userId));
      const { error } = await apiRequest(
        `/api/users/${userId}`,
        {
          method: 'DELETE',
        },
        token as string
      );

      if (error) return;

      // Refresh current page after deletion
      await fetchUsers(pagination.currentPage);
      toast.success('User deleted successfully');
    } finally {
      dispatch(setDeleteLoading(null));
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100svh',
        bgcolor: 'background.default',
        width: '100svw',
      }}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.displayName || 'User'}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogOut />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<UserPlus />}
              onClick={() => {
                setSelectedUser(undefined);
                setIsModalOpen(true);
              }}
              disabled={operationLoading.create}
              sx={{
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {operationLoading.create ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Add User'
              )}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <UserTable
                users={users}
                onEdit={openEditModal}
                onDelete={handleDeleteConfirm}
                operationLoading={operationLoading}
              />
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Paper>
      </Container>

      <UserModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSubmit={selectedUser ? handleEditUser : handleAddUser}
        initialValues={selectedUser}
        isEdit={!!selectedUser}
        loading={operationLoading.create || !!operationLoading.update}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirm({ open: false, userId: null })}
        loading={!!operationLoading.delete}
      />
    </Box>
  );
};

export default memo(Dashboard);
