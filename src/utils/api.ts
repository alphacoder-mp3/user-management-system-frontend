import { toast } from 'sonner';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {},
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const { requiresAuth = true, ...restConfig } = config;

    // const token = localStorage.getItem('token');  // we could have made use of this so that we don't have to pass token from everywhere, but since we wanted to stick with redux persist as we have used it already so we didn't make use of localstorage for this, we can't make use of redux persist outside component or hooks

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...config.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...restConfig,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}
