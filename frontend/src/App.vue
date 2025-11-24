<script setup>
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <Navbar />
    <router-view /> <!-- หน้าเว็บจะเปลี่ยนตรงนี้ -->
  </div>
</template>