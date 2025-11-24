const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('access_token');

export async function request(endpoint, options = {}) {
    const headers = { ...options.headers };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401 || response.status === 403) {
            if (endpoint === '/posts' && options.method === 'GET') {
                return response;
            }
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            throw new Error('Session Expired');
        }

        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export const api = {
    login: (credentials) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    
    getPosts: () => request('/posts', { method: 'GET' }),
    
    createPost: (formData) => request('/admin/posts', {
        method: 'POST',
        body: formData
    }),

    updatePost: (id, formData) => request(`/admin/posts/${id}`, {
        method: 'PUT',
        body: formData
    }),
    
    deletePost: (id) => request(`/admin/posts/${id}`, {
        method: 'DELETE'
    })
};