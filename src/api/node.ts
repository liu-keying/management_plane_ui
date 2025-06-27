import axios from 'axios'
import useGlobalConfig from '@/composables/useGlobalConfig';

const { useMock } = useGlobalConfig();

export interface NodeItem {
  nodeId: string
  nickname?: string
  fingerprint: string
  ipAddress: string
  role: 'VPS_TE' | 'VPS_RELAY' | 'CLIENT'
  status: 'ONLINE' | 'OFFLINE' | 'DESTROYING'
  riskLevel: number
  cpuUsage: number
  memoryUsage: number
  trafficIn: number
  trafficOut: number
  geoLocation: string
  cloudProvider: string
  createdAt: string
  createdBy: string
  lastHeartbeat: string
  relayCount: number
  maxRelayCapacity: number
}


export interface FetchNodeParams {
  status?: string
  role?: string
  cloudProvider?: string
}

export const fetchNodes = async (
  params: FetchNodeParams = {}
): Promise<NodeItem[]> => {
  if (useMock) {
    const res = await fetch('/mock/nodes.json')
    return await res.json()
  } else {
    const response = await axios.get<NodeItem[]>('/api/nodes', { params })
    return response.data
  }
}


/**
 * 获取指定节点详情
 * @param nodeId 节点ID
 * @returns 节点详情
 */
export const fetchNodeDetail = async (nodeId: string): Promise<NodeItem | null> => {
  if (useMock) {
    try {
      const res = await fetch('/mock/nodes.json')
      const data: NodeItem[] = await res.json()
      const node = data.find(item => item.nodeId === nodeId)
      return node ?? null
    } catch (error) {
      console.error('Failed to fetch mock nodes:', error)
      return null
    }
  }
  try {
    const response = await axios.get<NodeItem>(`/api/nodes/${nodeId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch node detail:', error)
    return null
  }
}