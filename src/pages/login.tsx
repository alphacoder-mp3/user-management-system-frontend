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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { loginSchema } from '../validation/schema';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/slices/auth-slice';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { LoginInputs, LoginResponse } from '../types';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        height: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        width: '100svw',
        p: { xs: 2, sm: 0 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: { xs: '100%', sm: '450px', md: '800px' },
          overflow: 'hidden',
          borderRadius: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            flex: { md: 1 },
            p: { xs: 3, sm: 4 },
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: { xs: '200px', md: 'auto' },
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Welcome
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'subtitle1'}
            gutterBottom
            sx={{ opacity: 0.9 }}
          >
            to online help center!
          </Typography>
          <Box sx={{ mt: { xs: 2, md: 4 } }}>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                gap: '8px',
                opacity: 0.9,
              }}
            >
              <CheckCircle size={isMobile ? 16 : 20} /> Secure and reliable for
              users
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                gap: '8px',
                opacity: 0.9,
              }}
            >
              <CheckCircle size={isMobile ? 16 : 20} /> Even your grandma can
              use it
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: 0.9,
              }}
            >
              <CheckCircle size={isMobile ? 16 : 20} /> Works 15% faster than
              others
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: { md: 1 },
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ mb: 3, fontWeight: 600 }}
              >
                Sign In
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                }}
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
                        size={isMobile ? 'small' : 'medium'}
                      >
                        {showPassword ? (
                          <EyeOff size={isMobile ? 18 : 20} />
                        ) : (
                          <Eye size={isMobile ? 18 : 20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: { xs: 1, sm: 2 } }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  py: { xs: 1.5, sm: 2 },
                }}
              >
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
