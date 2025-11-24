<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const posts = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const res = await api.getPosts();
        if (res.ok) posts.value = await res.json();
    } catch (error) {
        console.error("Load error", error);
    } finally {
        loading.value = false;
    }
});

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="border-l-4 border-blue-600 pl-4 mb-8">
        <h1 class="text-3xl font-bold text-gray-800">ข่าวประชาสัมพันธ์</h1>
        <p class="text-gray-500">อัปเดตข่าวสารล่าสุดจากทางเรา</p>
    </div>

    <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-500">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
        ยังไม่มีข่าวสารในขณะนี้
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
        <!-- Image -->
        <div class="h-48 bg-gray-100 relative">
             <img v-if="post.imagePath" :src="post.imagePath" class="w-full h-full object-cover">
             <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <span class="text-sm">ไม่มีรูปภาพ</span>
             </div>
        </div>
        
        <!-- Content -->
        <div class="p-5 flex-1 flex flex-col">
          <div class="text-xs text-blue-600 mb-2 font-semibold">
            {{ formatDate(post.createdAt) }}
          </div>
          <h2 class="text-xl font-bold mb-2 text-gray-800 leading-tight">{{ post.title }}</h2>
          <p class="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{{ post.content }}</p>
          <a href="#" class="text-blue-600 font-medium hover:underline text-sm mt-auto">อ่านเพิ่มเติม →</a>
        </div>
      </div>
    </div>
  </div>
</template>
