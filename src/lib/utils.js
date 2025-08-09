export default {
    install: function (Vue) {
        Vue.prototype.$debounce = function ( fn,delay){
            let timer = null //借助闭包
            return function() {
                if(timer){
                    clearTimeout(timer) //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
                    timer = setTimeout(fn,delay)
                }else{
                    timer = setTimeout(fn,delay) // 进入该分支说明当前并没有在计时，那么就开始一个计时
                }
            }
        }
    }
}

import { Message } from 'iview'; 

/**
 * 统一的API错误处理方法
 * @param {Error} error - 捕获的错误对象
 * @param {string} contextMessage - 错误上下文描述
 * @returns {null} - 始终返回null以表示处理失败
 */
export const handleApiError = (error, contextMessage) => {
  console.error(`${contextMessage}:`, error);
  const status = error.response?.status || '未知';
  const message = error.response?.data?.message || error.response?.data || error.message || '未知错误';
  const errorMessage = `[${status}] ${message}`;
  Message.error(errorMessage);
  return null;
};

/**
 * 通用的安全数据获取方法
 * @param {Function} fetchFunction - 数据获取函数
 * @param {string} errorContext - 错误上下文描述
 * @returns {Promise<any|null>} - 获取的数据或null（如果失败）
 */
export const handleApiSafely = async (fetchFunction, errorContext) => {
  try {
    const data = await fetchFunction();
    if (data === null) {
      Message.error(`${errorContext}失败`);
      return null;
    }
    return data;
  } catch (error) {
    return handleApiError(error, `获取${errorContext}失败`);
  }
};
