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
} from '@mui/material';
import { LogOut, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { logout } from '../store/slices/authSlice';
import {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
} from '../store/slices/userSlice';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import type { RootState } from '../store/store';
import UserModal from '../components/UserModal';
import UserTable from '../components/UserTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setUsers(usersList));
    } catch (error) {
      console.error({ error });
      toast.error('Failed to fetch users');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error({ error });
      toast.error('Failed to logout');
    }
  };

  const handleAddUser = async (data: any) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      dispatch(addUser({ id: docRef.id, ...data }));
      toast.success('User added successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to add user');
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, data);
      dispatch(updateUser({ id: selectedUser.id, ...data }));
      toast.success('User updated successfully');
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      dispatch(deleteUser(id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error({ error });
      toast.error('Failed to delete user');
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.displayName}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogOut />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">User Management</Typography>
            <Button
              variant="contained"
              startIcon={<UserPlus />}
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
            >
              Add User
            </Button>
          </Box>

          <UserTable
            users={users}
            onEdit={openEditModal}
            onDelete={handleDeleteUser}
          />
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
