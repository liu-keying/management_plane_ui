import axios from 'axios'
import useGlobalConfig from '@/composables/useGlobalConfig';

const { useMock } = useGlobalConfig();

export interface LinkItem {
    linkId: string
    relayIds: string[]
    routingPolicy: 'RANDOM' | 'RECOMMEND' | 'SPECIFIED'
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
    createdBy: string
    createdAt: string
    updatedAt: string
    circuitCount: number
    totalTraffic: number
    sourceRelayId: string
}


export interface FetchLinksParams {
    status?: string
    sourceNodeId?: string
    targetNodeId?: string
}

/**
 * 获取链路列表
 * @param params 查询参数（可选）
 * @returns 链路数据数组
 */
export const fetchLinks = async (
    params: FetchLinksParams = {}
): Promise<LinkItem[]> => {
    if (useMock) {
        const res = await fetch('/mock/links.json')
        return await res.json()
    } else {
        try {
            const response = await axios.get<LinkItem[]>('/api/links', { params })
            return response.data
        } catch (error) {
            console.error('Failed to fetch links:', error)
            return []
        }
    }
}



/**
 * 获取指定节点详情
 * @param linkId 节点ID
 * @returns 节点详情
 */
export const fetchLinkDetail = async (linkId: string): Promise<LinkItem | null> => {
  if (useMock) {
    try {
      const res = await fetch('/mock/links.json')
      const data: LinkItem[] = await res.json()
      const node = data.find(item => item.linkId === linkId)
      return node ?? null
    } catch (error) {
      console.error('Failed to fetch mock nodes:', error)
      return null
    }
  }
  try {
    const response = await axios.get<LinkItem>(`/api/links/${linkId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch link detail:', error)
    return null
  }
}