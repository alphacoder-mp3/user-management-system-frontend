export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName?: string;
}
export interface UserModalData {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserFormProps {
  onSubmit: (data: UserModalData) => Promise<void>;
  initialValues?: Partial<UserModalData>;
  isEdit?: boolean;
}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserModalData) => Promise<void>;
  initialValues?: Partial<UserModalData>;
  isEdit?: boolean;
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}
