import { ref } from 'vue';

export const useMockConfig = () => {
  const useMock = ref(true); // 切换 true/false 以使用 mock 数据或真实 API
  return {
    useMock,
  };
};

export const useRefreshConfig = () => {
  const refreshInterval = ref(60); // 默认刷新时间为60秒
  return {
    refreshInterval,
  };
};
