<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
    isLoggedIn.value = !!localStorage.getItem('access_token');
});

const logout = () => {
    localStorage.removeItem('access_token');
    isLoggedIn.value = false;
    router.push('/');
    setTimeout(() => window.location.reload(), 50); // รีโหลดเพื่อเคลียร์ State
};
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 h-16 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold text-blue-600 flex items-center gap-2">
        <span>📰</span> NewsBlog
      </router-link>
      
      <div class="flex items-center gap-4 text-sm font-medium">
        <router-link to="/" class="text-gray-600 hover:text-blue-600">หน้าหลัก</router-link>
        
        <template v-if="!isLoggedIn">
           <router-link to="/login" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
             เข้าสู่ระบบ
           </router-link>
        </template>
        
        <template v-else>
           <router-link to="/admin" class="text-gray-600 hover:text-blue-600">จัดการระบบ</router-link>
           <button @click="logout" class="text-red-500 hover:text-red-700">
             ออกจากระบบ
           </button>
        </template>
      </div>
    </div>
  </nav>
</template>
