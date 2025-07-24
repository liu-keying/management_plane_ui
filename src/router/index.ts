import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/home/index.vue';
import NodeList from '@/pages/node/index.vue';
import NodeDetail from '@/pages/node/detail.vue';

import LinkList from '@/pages/link/index.vue';
import LinkDetail from '@/pages/link/detail.vue';

import AlertPage from '@/pages/alert/index.vue';

import UserPage from '@/pages/user/index.vue';

import SituationPage from '@/pages/situation/index.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/node',
    name: 'Node',
    component: NodeList,
  },
  // { 
  //   path: '/node/:nodeId', 
  //   name: 'NodeDetail', 
  //   component: NodeDetail, 
  //   props: true 
  // },
  {
    path: '/link',
    name: 'Link',
    component: LinkList,
  },
  // { 
  //   path: '/link/:linkId', 
  //   name: 'LinkDetail', 
  //   component: LinkDetail, 
  //   props: true 
  // },
  {
    path: '/alert',
    name: 'Alert',
    component: AlertPage,
  },
  {
    path: '/users',
    name: 'User',
    component: UserPage,
  },
  {
    path: '/situation',
    name: 'Situation',
    component: SituationPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
