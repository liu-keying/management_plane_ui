import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/home/index.vue';
import NodeList from '@/pages/node/list.vue';
import NodeDetail from '@/pages/node/detail.vue';
import NodeUpdate from '@/pages/node/update.vue';
import NodeCreate from '@/pages/node/create.vue';
import LinkList from '@/pages/link/list.vue';
import LinkDetail from '@/pages/link/detail.vue';
import LinkCreate from '@/pages/link/create.vue';
import LinkUpdate from '@/pages/link/update.vue';
import AlertPage from '@/pages/alert/index.vue';

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
  { 
    path: '/node/:nodeId', 
    name: 'NodeDetail', 
    component: NodeDetail, 
    props: true 
  },
  { 
    path: '/node/:nodeId/update', 
    name: 'NodeUpdate', 
    component: NodeUpdate, 
    props: true 
  },
  { 
    path: '/node/create', 
    name: 'NodeCreate', 
    component: NodeCreate, 
    props: true 
  },
  {
    path: '/link',
    name: 'Link',
    component: LinkList,
  },
  { 
    path: '/link/:linkId', 
    name: 'LinkDetail', 
    component: LinkDetail, 
    props: true 
  },
  { 
    path: '/link/create', 
    name: 'LinkCreate', 
    component: LinkCreate, 
    props: true 
  },
  { 
    path: '/link/:linkId/update', 
    name: 'LinkUpdate', 
    component: LinkUpdate, 
    props: true 
  },
  {
    path: '/alert',
    name: 'Alert',
    component: AlertPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
