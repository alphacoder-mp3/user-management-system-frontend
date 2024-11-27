import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Edit2, Trash2 } from 'lucide-react';
import { UserTableProps } from '../types';

const UserTable = ({
  users,
  onEdit,
  onDelete,
  operationLoading,
}: UserTableProps) => {
  if (users.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No users found. Add your first user to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        '& .MuiTableCell-root': {
          borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Sr No.</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{ '&:hover': { bgcolor: 'action.hover' } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onEdit(user)}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                  disabled={
                    !!operationLoading.update || !!operationLoading.delete
                  }
                >
                  {operationLoading.update === user.id ? (
                    <CircularProgress size={18} color="primary" />
                  ) : (
                    <Edit2 size={18} />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => onDelete(user.id)}
                  color="error"
                  size="small"
                  disabled={
                    !!operationLoading.update || !!operationLoading.delete
                  }
                >
                  {operationLoading.delete === user.id ? (
                    <CircularProgress size={18} color="error" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
