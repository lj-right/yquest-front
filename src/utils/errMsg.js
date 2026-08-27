/**
 * 统一提取后端错误文案
 * 后端 Result.fail(Object) 重载会把具体错误文案放入 date 字段，message 只有通用的"失败"。
 * 规则：message 为通用"失败"且 date 为字符串时取 date，否则取 message，均无效时返回 fallback。
 *
 * @param {Object} resData 后端返回的 Result 对象（axios 的 response.data）
 * @param {String} fallback 兜底文案
 * @returns {String} 错误文案
 */
export function pickErrMsg(resData, fallback) {
  if (resData) {
    const msg = resData.message
    const date = resData.date
    if (msg && msg !== '失败') {
      return msg
    }
    if (typeof date === 'string' && date) {
      return date
    }
    if (msg) {
      return msg
    }
  }
  return fallback || '操作失败'
}
