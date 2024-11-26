import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { X } from 'lucide-react';
import UserForm from './user-form';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: any;
  isEdit?: boolean;
}

const UserModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit,
}: UserModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, bgcolor: 'background.paper' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isEdit ? 'Edit User' : 'Add New User'}
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'text.primary',
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          '& .MuiDialogContent-dividers': {
            borderColor: 'divider',
          },
        }}
      >
        <UserForm
          onSubmit={onSubmit}
          initialValues={initialValues}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
