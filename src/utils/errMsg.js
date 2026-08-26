/**
 * 提取接口错误文案。
 * 后端部分失败响应（Result.fail(Object)）把具体错误放在 date 字段，
 * message 只有通用的"失败"，因此优先取 date 中的可读文案。
 *
 * @param {Object} resData 接口响应体（res.data）
 * @param {String} fallback 兜底文案
 * @returns {String}
 */
export function pickErrMsg(resData, fallback) {
  if (!resData) return fallback
  const msg = resData.message
  const date = resData.date
  // 具体错误文案在 date 且 message 为通用"失败"（或为空）时取 date
  if (typeof date === "string" && date && (!msg || msg === "失败")) {
    return date
  }
  return msg || fallback
}
