import { ref } from 'vue';

const useMock = ref(true); // 切换 true/false 以使用 mock 数据或真实 API

export default function useGlobalConfig() {
  return { useMock };
}
