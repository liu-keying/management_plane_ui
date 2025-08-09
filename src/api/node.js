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

/**
 * 获取指定节点上的中继列表
 * @param nodeId 节点ID
 * @returns 中继列表
 */
export const fetchRelayList = async (nodeId) => {
  if (useMock.value === true) {
    // 添加随机错误模拟 - 约20%的概率返回错误
    const shouldFail = Math.random() < 0.2;
    
    if (shouldFail) {
      // 模拟错误情况
      const error = new Error('Node not found');
      error.response = {
        status: 404,
        data: { message: `Node with ID ${nodeId} not found` }
      };
      throw error;
    }
    
    const res = await fetch('/mock/relays.json');
    if (!res.ok) {
      throw new Error('Failed to fetch mock data');
    }
    
    const data = await res.json();
    return data.filter(item => item.nodeId === nodeId) || [];
  } 
  
  try {
    const response = await axios.get(`/api/nodes/${nodeId}/relays`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch relays for node:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

/**
 * 在指定节点上创建中继
 * @param {string} nodeId - 节点ID
 * @param {Object} relayData - 中继数据
 * @param {string} relayData.type - 中继类型：ANONYMOUS或ACCESS
 * @param {string} relayData.role - 中继角色：ROLE_DA, ROLE_RELAY, ROLE_EXIT, ROLE_CLIENT, ROLE_HS
 * @param {string} relayData.userId - 用户ID
 * @returns {Promise<string>} - 创建结果消息
 */
export const createRelay = async (nodeId, relayData) => {
  if (useMock.value === true) {
    // 模拟随机成功或失败
    const shouldFail = Math.random() < 0.2;
    
    if (shouldFail) {
      // 模拟失败情况
      const error = new Error('Failed to create relay');
      error.response = {
        status: 500,
        data: "节点创建失败.节点资源不足或状态异常"
      };
      throw error;
    }
    
    // 模拟成功情况
    return "节点创建成功.中继ID: relay-" + Date.now().toString().slice(-6);
  }
  
  try {
    const response = await axios.post(`/api/nodes/${nodeId}/relays`, relayData);
    return response.data; // 直接返回响应字符串
  } catch (error) {
    console.error('Failed to create relay:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

/**
 * 更新指定节点的信息
 * @param {string} nodeId - 节点ID
 * @param {Object} nodeData - 节点数据
 * @param {string} nodeData.role - 节点角色：VPS_RELAY, VPS_DA, CLIENT
 * @param {string} nodeData.status - 节点状态：ONLINE, OFFLINE, DESTROYING
 * @param {string} nodeData.userId - 用户ID
 * @returns {Promise<string>} - 更新结果消息
 */
export const updateNode = async (nodeId, nodeData) => {
  if (useMock.value === true) {
    // 模拟随机成功或失败
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      // 模拟失败情况
      const error = new Error('Failed to update node');
      error.response = {
        status: 500,
        data: "节点更新失败.节点不存在或状态异常"
      };
      throw error;
    }
    
    // 模拟成功情况
    return `节点更新成功.节点ID: ${nodeId}, 角色: ${nodeData.role}, 状态: ${nodeData.status||'未知'}`;
  }
  
  try {
    const response = await axios.put(`/api/nodes/node/${nodeId}`, nodeData);
    return response.data; // 返回API响应信息
  } catch (error) {
    console.error('Failed to update node:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

/**
 * 销毁指定节点
 * @param {string} nodeId - 节点ID
 * @param {string} userId - 用户ID (必需)
 * @returns {Promise<string>} - 销毁结果消息
 */
export const deleteNode = async (nodeId, userId) => {
  if (useMock.value === true) {
    // 模拟随机成功或失败
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      // 模拟失败情况
      const error = new Error('Failed to delete node');
      error.response = {
        status: 500,
        data: "节点销毁失败.节点可能有正在运行的中继或状态异常"
      };
      throw error;
    }
    
    // 模拟成功情况
    return `节点销毁成功.节点ID: ${nodeId}`;
  }
  
  try {
    // 注意这里需要传递userId作为请求参数
    const response = await axios.delete(`/api/nodes/node/${nodeId}?userId=${userId}`);
    return response.data; // 返回API响应信息
  } catch (error) {
    console.error('Failed to delete node:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

/**
 * 更新指定中继的信息
 * @param {string} relayId - 中继ID
 * @param {Object} relayData - 中继数据
 * @param {string} relayData.type - 中继类型：ANONYMOUS或ACCESS
 * @param {string} relayData.role - 中继角色：ROLE_DA, ROLE_RELAY, ROLE_EXIT, ROLE_CLIENT, ROLE_HS
 * @param {string} relayData.userId - 用户ID
 * @returns {Promise<string>} - 更新结果消息
 */
export const updateRelay = async (relayId, relayData) => {
  if (useMock.value === true) {
    // 模拟随机成功或失败
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      // 模拟失败情况
      const error = new Error('Failed to update relay');
      error.response = {
        status: 500,
        data: "中继更新失败.中继不存在或状态异常"
      };
      throw error;
    }
    
    // 模拟成功情况
    return `中继更新成功.中继ID: ${relayId}, 类型: ${relayData.type}, 角色: ${relayData.role}`;
  }
  
  try {
    const response = await axios.put(`/api/nodes/relay/${relayId}`, relayData);
    return response.data; // 返回API响应信息
  } catch (error) {
    console.error('Failed to update relay:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

/**
 * 销毁指定中继
 * @param {string} relayId - 中继ID
 * @param {Object} requestData - 请求数据
 * @param {string} requestData.userId - 用户ID
 * @returns {Promise<string>} - 销毁结果消息
 */
export const deleteRelay = async (relayId, requestData) => {
  if (useMock.value === true) {
    // 模拟随机成功或失败
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      // 模拟失败情况
      const error = new Error('Failed to delete relay');
      error.response = {
        status: 500,
        data: "中继销毁失败.中继可能不存在或状态异常"
      };
      throw error;
    }
    
    // 模拟成功情况
    return `中继销毁成功.中继ID: ${relayId}`;
  }
  
  try {
    // 注意这里使用DELETE方法但需要传递请求体
    const response = await axios.delete(`/api/nodes/relay/${relayId}`, { 
      data: requestData // axios中DELETE请求的请求体需要通过data属性传递
    });
    return response.data; // 返回API响应信息
  } catch (error) {
    console.error('Failed to delete relay:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
};



