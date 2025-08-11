import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    PREDICT_SIMULATED: '/api/predict',
    PREDICT_STREAMLIT: '/api/predict-streamlit',
    HEALTH: '/health',
    AUTH: '/api/auth',
    PREDICTIONS: '/api/predictions'
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token (optional)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't automatically redirect on auth errors for predictions
      console.warn('Authentication failed, but continuing...');
    }
    return Promise.reject(error);
  }
);

export interface PredictionRequest {
  age: string;
  dependants: string;
  income: string;
  geneticalRisk: string;
  insurancePlan: string;
  employmentStatus: string;
  gender: string;
  maritalStatus: string;
  bmiCategory: string;
  smokingStatus: string;
  region: string;
  medicalHistory: string;
}

export interface PredictionResponse {
  success: boolean;
  prediction: number;
  data: any;
  source?: string;
  error?: string;
  message?: string;
  predictionId?: string;
}

export const api = {
  predict: async (data: PredictionRequest): Promise<PredictionResponse> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PREDICT_SIMULATED, data);
    return response.data;
  },

  getPredictions: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PREDICTIONS);
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/api/dashboard');
    return response.data;
  },
};

export const authAPI = {
  // Development helper - create a test token when MongoDB is not available
  createDevToken: async () => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/dev/create-token`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create dev token');
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/login`, {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      // If login fails due to database issues, try creating a dev token
      if (error.response?.status === 500 && process.env.NODE_ENV === 'development') {
        console.log('🔄 Login failed, trying dev token...');
        try {
          return await authAPI.createDevToken();
        } catch (devError) {
          throw new Error(error.response?.data?.error || 'Login failed');
        }
      }
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  getProfile: async (token: string) => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  },

  updateProfile: async (profileData: any, token: string) => {
    try {
      const response = await axios.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  },
};
