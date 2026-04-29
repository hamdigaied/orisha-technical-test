import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'residents',
    component: () => import('@/pages/ResidentsListPage.vue'),
  },
  {
    path: '/residents/:id',
    name: 'resident-detail',
    component: () => import('@/pages/ResidentDetailPage.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'residents' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});
