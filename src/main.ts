import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/style/reset.scss";
import '@/style/global.css';
import ECharts from 'vue-echarts';
import 'echarts';

const app = createApp(App);
app.component('v-chart', ECharts);
app.use(router)
app.use(ElementPlus);
app.mount('#app');