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
  useTheme,
  useMediaQuery,
  Card,
  Stack,
  Divider,
} from '@mui/material';
import { Edit2, Trash2 } from 'lucide-react';
import { UserTableProps } from '../types';

const UserTable = ({
  users,
  onEdit,
  onDelete,
  operationLoading,
}: UserTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {users.map((user, index) => (
          <Card
            key={user.id}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  User #{index + 1}
                </Typography>
                <Box>
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
                </Box>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1">
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
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
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
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
