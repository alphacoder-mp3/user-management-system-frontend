export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
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
  loading?: boolean;
}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserModalData) => Promise<void>;
  initialValues?: Partial<UserModalData>;
  isEdit?: boolean;
  loading?: boolean;
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  operationLoading: {
    create: boolean;
    update: string | null;
    delete: string | null;
  };
}

export interface UsersState {
  users: User[];
  loading: boolean;
  operationLoading: {
    create: boolean;
    update: string | null;
    delete: string | null;
  };
  error: string | null;
}

export interface AuthState {
  user: null | {
    uid: string;
    email: string;
    displayName: string;
  };
  token: string | null;
}
