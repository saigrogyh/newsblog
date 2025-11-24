<script setup>
import { ref } from 'vue';
import { api } from '../services/api';

const username = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
    try {
        errorMsg.value = '';
        const res = await api.login({ username: username.value, password: password.value });
        
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('access_token', data.token);
            window.location.href = '/admin';
        } else {
            errorMsg.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        }
    } catch (err) {
        errorMsg.value = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
    }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบ</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
           <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
           <input v-model="username" type="text" class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
           <input v-model="password" type="password" class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
        </div>
        
        <div v-if="errorMsg" class="bg-red-50 text-red-500 text-sm p-2 rounded border border-red-200 text-center">
            {{ errorMsg }}
        </div>
        
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
            Log In
        </button>
      </form>
    </div>
  </div>
</template>