import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../pages/Home.vue') },
  { path: '/recommend', name: 'recommend', component: () => import('../pages/Recommend.vue') },
  { path: '/schools', name: 'schools', component: () => import('../pages/Schools.vue') },
  { path: '/joint-program', name: 'joint-program', component: () => import('../pages/JointProgram.vue') },
  { path: '/volunteers', name: 'volunteers', component: () => import('../pages/VolunteerList.vue') },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
