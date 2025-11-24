const BASE_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('access_token');

export async function request(endpoint, options = {}) {
    const headers = { ...options.headers };
    
    // แนบ Token อัตโนมัติถ้ามี
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // ถ้าไม่ใช่การส่งไฟล์ (FormData) ให้ระบุเป็น JSON
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        // ถ้า Token หมดอายุ (401/403)
        if (response.status === 401 || response.status === 403) {
            // ยกเว้นกรณีหน้าแรก (Home) ที่คนทั่วไปอ่านได้ ไม่ต้องดีดไป Login
            if (endpoint === '/posts' && options.method === 'GET') {
                return response;
            }
            // กรณีอื่น (เช่นหน้า Admin) ให้ดีดออก
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
    // Login (ส่ง username/password)
    login: (credentials) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    
    // ดึงข่าวทั้งหมด (Public)
    getPosts: () => request('/posts', { method: 'GET' }),
    
    // สร้างข่าวใหม่ (Private - Admin)
    createPost: (formData) => request('/admin/posts', {
        method: 'POST',
        body: formData
    }),

    // แก้ไขข่าว (Private - Admin) **เพิ่มมาใหม่**
    updatePost: (id, formData) => request(`/admin/posts/${id}`, {
        method: 'PUT',
        body: formData
    }),
    
    // ลบข่าว (Private - Admin)
    deletePost: (id) => request(`/admin/posts/${id}`, {
        method: 'DELETE'
    })
};
