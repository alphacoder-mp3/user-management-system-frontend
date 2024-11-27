import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { loginSchema } from '../validation/schema';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/slices/auth-slice';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface LoginInputs {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    const { data: user, error } = await apiRequest<LoginResponse>('/api/auth', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });

    if (error || !user) return;

    dispatch(
      setUser({
        uid: user.id,
        email: user.email,
        displayName: `${user.firstName} ${user.lastName}`,
      })
    );
    dispatch(setToken(user.token));
    // localStorage.setItem('token', user.token);
    navigate('/dashboard');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                type={showPassword ? 'text' : 'password'}
                label="Password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
