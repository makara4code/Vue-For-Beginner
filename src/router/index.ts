import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

import DashboardView from "@/views/DashboardView.vue";
import NotFound from "@/components/404-NotFound.vue";
import OrderView from "@/views/OrderView.vue"
import LoginView from "@/views/LoginView.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView },
  {
    path: '/',
    meta: { requiresAuth: true },
    component: DashboardLayout,
    children: [
      { path: 'dashboard', component: DashboardView },
      { path: 'order', component: OrderView },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;