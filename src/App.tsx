import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { theme } from './theme';
import { store } from './store/store';
import Login from './pages/login';
import { Suspense, lazy } from 'react';
const Dashboard = lazy(() => import('./components/dashboard'));
import ProtectedRoute from './components/protected-routes';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      {' '}
                      <Dashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
