import axios from 'axios'
import {useMockConfig} from '@/composables/useGlobalConfig.js';

const { useMock } = useMockConfig();

export const fetchNodes = async (
  params = {}
) => {
  if (useMock.value === true) {
    const res = await fetch('/mock/nodes.json')
    return await res.json()
  } else {
    const response = await axios.get('/api/nodes', { params })
    return response.data
  }
}

/**
 * 获取指定节点详情
 * @param nodeId 节点ID
 * @returns 节点详情
 */
export const fetchNodeDetail = async (nodeId) => {
  if (useMock.value === true) {
    try {
      const res = await fetch('/mock/nodes.json')
      const data = await res.json()
      const node = data.find(item => item.nodeId === nodeId)
      return node ?? null
    } catch (error) {
      console.error('Failed to fetch mock nodes:', error)
      return null
    }
  }
  try {
    const response = await axios.get(`/api/nodes/${nodeId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch node detail:', error)
    return null
  }
}
