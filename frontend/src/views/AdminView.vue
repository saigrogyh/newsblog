<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const posts = ref([]);
const showModal = ref(false);
const modalMode = ref('add'); // 'add' หรือ 'edit'

// Form Data
const form = ref({
    id: null,
    title: '',
    content: '',
    image: null,
    previewImage: null // ไว้โชว์รูปตัวอย่างตอนเลือกไฟล์
});

// โหลดข้อมูลข่าว
const fetchPosts = async () => {
    try {
        const res = await api.getPosts();
        if (res.ok) posts.value = await res.json();
    } catch (err) {
        console.error(err);
    }
};

// เปิด Modal (แยกกรณี เพิ่ม หรือ แก้ไข)
const openModal = (mode, post = null) => {
    modalMode.value = mode;
    showModal.value = true;
    
    if (mode === 'edit' && post) {
        // กรณีแก้ไข: เอาข้อมูลเดิมมาใส่ Form
        form.value = {
            id: post.id,
            title: post.title,
            content: post.content,
            image: null, // รีเซ็ตไฟล์ใหม่
            previewImage: post.imagePath // เอารูปเดิมมาโชว์ก่อน
        };
    } else {
        // กรณีเพิ่ม: เคลียร์ Form
        form.value = { id: null, title: '', content: '', image: null, previewImage: null };
    }
};

// จัดการเมื่อเลือกไฟล์รูป
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.value.image = file;
        // สร้าง URL ชั่วคราวเพื่อแสดงตัวอย่างรูป
        form.value.previewImage = URL.createObjectURL(file);
    }
};

// บันทึกข้อมูล (Submit)
const handleSubmit = async () => {
    if (!form.value.title || !form.value.content) return alert('กรุณากรอกหัวข้อและเนื้อหา');

    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('content', form.value.content);
    if (form.value.image) {
        formData.append('image', form.value.image);
    }

    try {
        let res;
        if (modalMode.value === 'add') {
            res = await api.createPost(formData);
        } else {
            res = await api.updatePost(form.value.id, formData);
        }

        if (res.ok) {
            alert('บันทึกสำเร็จ!');
            showModal.value = false;
            fetchPosts(); // โหลดข้อมูลใหม่
        } else {
            alert('เกิดข้อผิดพลาดจาก Server');
        }
    } catch (err) {
        alert('เชื่อมต่อล้มเหลว');
    }
};

// ลบข่าว
const handleDelete = async (id) => {
    if (!confirm('ยืนยันที่จะลบข่าวนี้?')) return;
    try {
        const res = await api.deletePost(id);
        if (res.ok) fetchPosts();
    } catch (err) {
        alert('ลบไม่สำเร็จ');
    }
};

onMounted(fetchPosts);
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">จัดการข่าวสาร</h1>
        <button @click="openModal('add')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow">
            + เพิ่มข่าวใหม่
        </button>
    </div>

    <!-- Table แสดงรายการ -->
    <div class="bg-white rounded shadow overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รูปภาพ</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หัวข้อ</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จัดการ</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                        <img v-if="post.imagePath" :src="post.imagePath" class="h-12 w-12 object-cover rounded">
                        <div v-else class="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="font-medium text-gray-900">{{ post.title }}</div>
                        <div class="text-gray-500 text-sm truncate w-64">{{ post.content }}</div>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <button @click="openModal('edit', post)" class="text-yellow-600 hover:text-yellow-800 font-medium">แก้ไข</button>
                        <button @click="handleDelete(post.id)" class="text-red-600 hover:text-red-900 font-medium">ลบ</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal Form (Popup) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <h3 class="text-xl font-bold mb-4">{{ modalMode === 'add' ? 'เพิ่มข่าวใหม่' : 'แก้ไขข่าว' }}</h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">หัวข้อข่าว</label>
                    <input v-model="form.title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">เนื้อหา</label>
                    <textarea v-model="form.content" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">รูปภาพ</label>
                    <input type="file" @change="handleFileChange" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    <!-- Preview Image -->
                    <div v-if="form.previewImage" class="mt-2">
                        <img :src="form.previewImage" class="h-32 rounded object-cover border">
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">ยกเลิก</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">บันทึก</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>
