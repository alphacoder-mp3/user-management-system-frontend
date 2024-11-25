import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, Button, Grid } from '@mui/material';
import { userSchema } from '../validation/schema';

interface UserFormInputs {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormInputs) => void;
  initialValues?: Partial<UserFormInputs>;
  isEdit?: boolean;
}

const UserForm = ({ onSubmit, initialValues, isEdit }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: yupResolver(userSchema),
    defaultValues: initialValues,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Middle Name"
            {...register('middleName')}
            error={!!errors.middleName}
            helperText={errors.middleName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        </Grid>
        {!isEdit && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="reset" variant="outlined">
              Clear
            </Button>
            <Button type="submit" variant="contained">
              {isEdit ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
