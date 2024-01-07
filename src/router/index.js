// 1. 导入创建路由对象 和 创建hash对象
import { createRouter, createWebHistory } from 'vue-router';
 
// 2. 导入组件
import AnimepageVue from '@/views/AnimePage.vue';
import HomepageVue from '@/views/HomePage.vue';
import VediopageVue from '@/views/VedioPage.vue';
// 3. 配置路由映射关系表
const routes = [
  // 路径和组件映射起来
  {path: '/', component:HomepageVue },
  {name:'about', path: '/about', component: AnimepageVue },
  {name:'play', path: '/play', component: VediopageVue },
];
 
// 4. 创建路由对象
const router = new createRouter({
  // 5. 配置路由跳转模式，这里使用 hash 模式
  history: createWebHistory(),
  // 把映射表放入
  routes
});
 
// 5. 导出
export default router;