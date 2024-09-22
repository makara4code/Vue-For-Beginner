import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from "@/views/DashboardView.vue";
import NotFound from "@/components/404-NotFound.vue";
import OrderView from "@/views/OrderView.vue"

import DashboardLayout from "@/layouts/DashboardLayout.vue";

const routes = [
    { path: '/', redirect: "/dashboard" },
    {
        path: "/",
        component: DashboardLayout,
        children: [
            { path: '/dashboard', component: DashboardView },
            { path: "/order", component: OrderView },
            { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;