import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import { toast } from 'sonner';
import { loginSchema } from '../validation/schema';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/slices/auth-slice';
import { CheckCircle } from 'lucide-react';

interface LoginInputs {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const user = await response.json();
      dispatch(
        setUser({
          uid: user.id,
          email: user.email,
          displayName: `${user.firstName} ${user.lastName}`,
        })
      );
      dispatch(setToken(user.token)); // Ensure your backend sends a token
      navigate('/dashboard');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        width: '100svw',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          width: '800px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 4,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            to online help center!
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: '4px' }}
            >
              <CheckCircle /> Secure and reliable for users
            </Typography>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: '4px' }}
            >
              <CheckCircle /> Even your grandma can use it
            </Typography>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <CheckCircle /> Works 15% faster than others
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" size="large">
                Log in
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
