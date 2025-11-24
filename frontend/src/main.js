import { createApp } from 'vue'
import './style.css' // ไฟล์ css หลักของ Vite (ที่มี Tailwind imports)
import App from './App.vue'
import router from './router' // Import router ที่เราสร้าง

const app = createApp(App)

app.use(router) // บอกให้ Vue ใช้ Router
app.mount('#app')