import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedRequestsQueue = [];

const refreshTokenRequest = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        window.location.href = '/login';
        throw new Error('No refresh token available');
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }
        return accessToken;
    } catch (error) {
        console.error('refreshTokenRequest: Error during token refresh:', error.response?.status, error.message, error.response?.data);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        window.location.href = '/login';
        throw error;
    }
};

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {

            if (!originalRequest._accessTokenRetried) {
                originalRequest._accessTokenRetried = true;

                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    return apiClient(originalRequest);
                }
            }

            if (!originalRequest._refreshTokenRetried) {
                originalRequest._refreshTokenRetried = true;

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedRequestsQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return apiClient(originalRequest);
                        })
                        .catch((err) => {
                            console.error('Response Interceptor: Queued request for URL:', originalRequest.url, 'failed:', err);
                            return Promise.reject(err);
                        });
                }

                isRefreshing = true;

                try {
                    const newToken = await refreshTokenRequest();

                    failedRequestsQueue.forEach((prom) => prom.resolve(newToken));
                    failedRequestsQueue = [];

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error('Response Interceptor: Token refresh failed:', refreshError);
                    failedRequestsQueue.forEach((prom) => prom.reject(refreshError));
                    failedRequestsQueue = [];
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('username');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('username', response.username);

    window.dispatchEvent(new CustomEvent('authStatusChanged', {
        detail: { username: response.username }
    }));

    return response;
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    window.dispatchEvent(new CustomEvent('authStatusChanged', {
        detail: { username: null }
    }));
    window.location.href = '/login';
};

export default apiClient;
