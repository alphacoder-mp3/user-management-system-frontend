import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, 'Email must be at least 3 characters')
    .matches(/^\S*$/, 'No spaces allowed')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must not exceed 12 characters')
    .matches(/^\S*$/, 'No spaces allowed')
    .required('Password is required'),
});

export const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  middleName: yup.string(),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .max(20, 'Email must not exceed 20 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});
