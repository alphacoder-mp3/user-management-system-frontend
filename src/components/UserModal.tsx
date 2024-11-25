import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import UserForm from './UserForm';

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {isEdit ? 'Edit User' : 'Add New User'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
