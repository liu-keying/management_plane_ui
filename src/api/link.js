import axios from 'axios'
import {useMockConfig} from '@/composables/useGlobalConfig';

const { useMock } = useMockConfig();

/**
 * 获取链路列表
 * @param params 查询参数（可选）
 * @returns 链路数据数组
 */
export const fetchLinks = async (
    params = {}
) => {
    if (useMock.value === true) {
        const res = await fetch('/mock/links.json')
        return await res.json()
    } else {
        try {
            const response = await axios.get('/api/links', { params })
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
export const fetchLinkDetail = async (linkId) => {
    if (useMock.value === true) {
        try {
            const res = await fetch('/mock/links.json')
            const data = await res.json()
            const node = data.find(item => item.linkId === linkId)
            return node ?? null
        } catch (error) {
            console.error('Failed to fetch mock nodes:', error)
            return null
        }
    }
    try {
        const response = await axios.get(`/api/links/${linkId}`)
        return response.data
    } catch (error) {
        console.error('Failed to fetch link detail:', error)
        return null
    }
}
