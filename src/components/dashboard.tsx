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
import { auth, db } from '../firebase/config';
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import type { RootState } from '../store/store';
import UserModal from './user-modal';
import UserTable from './user-table';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      dispatch(setLoading(true));
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(usersQuery);
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setUsers(usersList));
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleAddUser = async (data: any) => {
    try {
      dispatch(setLoading(true));
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `${data.username}@example.com`,
        data.password
      );

      // Add user to Firestore
      const userDoc = {
        uid: userCredential.user.uid,
        firstName: data.firstName,
        middleName: data.middleName || '',
        lastName: data.lastName,
        username: data.username,
        email: data.username,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'users'), userDoc);
      dispatch(addUser({ id: docRef.id, ...userDoc }));
      toast.success('User added successfully');
      setIsModalOpen(false);
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to add user');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      dispatch(setLoading(true));
      const userRef = doc(db, 'users', selectedUser.id);
      const updateData = {
        firstName: data.firstName,
        middleName: data.middleName || '',
        lastName: data.lastName,
        username: data.username,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updateData);
      dispatch(updateUser({ id: selectedUser.id, ...updateData }));
      toast.success('User updated successfully');
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      dispatch(setLoading(true));
      await deleteDoc(doc(db, 'users', id));
      dispatch(deleteUser(id));
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const openEditModal = (user: any) => {
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
                setSelectedUser(null);
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
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleEditUser : handleAddUser}
        initialValues={selectedUser}
        isEdit={!!selectedUser}
      />
    </Box>
  );
};

export default Dashboard;
