import { useState, useEffect } from 'react';
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
  addUser,
  updateUser,
  deleteUser,
  setLoading,
} from '../store/slices/user-slice';
import type { RootState } from '../store/store';
import UserModal from './user-modal';
import UserTable from './user-table';
import { User, UserModalData } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserModalData | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: User[] = await response.json();
        dispatch(setUsers(data));
      } catch (error) {
        toast.error((error as Error).message || 'Failed to fetch users');
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [dispatch, token]);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate('/');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to logout');
    }
  };

  const handleAddUser = async (data: UserModalData) => {
    // `${import.meta.env.VITE_API_BASE_URL}
    try {
      dispatch(setLoading(true));
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const user: User = await response.json();
      dispatch(addUser(user));
      toast.success('User added successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add user');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditUser = async (data: UserModalData) => {
    if (!selectedUser) return;

    try {
      dispatch(setLoading(true));
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${selectedUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser: User = await response.json();
      dispatch(updateUser(updatedUser));
      toast.success('User updated successfully');
      setIsModalOpen(false);
      setSelectedUser(undefined);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update user');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error('Failed to delete user');
        throw new Error(errorData.error || 'Failed to delete user');
      }

      dispatch(deleteUser(id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete user');
    } finally {
      dispatch(setLoading(false));
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
              Add User
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UserTable
              users={users}
              onEdit={openEditModal}
              onDelete={handleDeleteUser}
            />
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
      />
    </Box>
  );
};

export default Dashboard;
