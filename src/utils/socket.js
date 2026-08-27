/**
 * WebSocket 连接工具（通知模块）
 * 单例连接 + 心跳保活 + 断线重连
 * 服务端：/chicken/socket?erp=xxx（erp 为登录账号 email）
 */

let socket = null
let heartbeatTimer = null
let reconnectTimer = null
let currentErp = null
let messageListener = null

// 心跳间隔 25s（服务端收到 "ping" 回 "pong"）
const HEARTBEAT_INTERVAL = 25000
// 断线重连间隔
const RECONNECT_DELAY = 5000

function buildUrl(erp) {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${window.location.host}/chicken/socket?erp=${encodeURIComponent(erp)}`
}

function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send('ping')
    }
  }, HEARTBEAT_INTERVAL)
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

function scheduleReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (currentErp) {
      connect()
    }
  }, RECONNECT_DELAY)
}

function connect() {
  if (!currentErp) {
    return
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  try {
    socket = new WebSocket(buildUrl(currentErp))
  } catch (e) {
    console.error('WebSocket 创建失败：', e)
    scheduleReconnect()
    return
  }
  socket.onopen = () => {
    startHeartbeat()
  }
  socket.onmessage = (event) => {
    // 心跳响应（pong）与"连接成功"为纯文本，通知消息为 JSON
    try {
      const data = JSON.parse(event.data)
      if (data && data.msgType && messageListener) {
        messageListener(data)
      }
    } catch (e) {
      // 忽略非 JSON 消息
    }
  }
  socket.onclose = () => {
    stopHeartbeat()
    // 非主动关闭则重连
    if (currentErp) {
      scheduleReconnect()
    }
  }
  socket.onerror = () => {
    // 触发 onclose 统一走重连
    try {
      socket.close()
    } catch (e) {
      // ignore
    }
  }
}

/**
 * 初始化（或复用）通知 socket 连接
 * @param {string} erp 登录账号（email）
 * @param {Function} onMessage 收到通知消息的回调（参数为解析后的 JSON 对象）
 */
export function initSocket(erp, onMessage) {
  if (typeof onMessage === 'function') {
    messageListener = onMessage
  }
  if (!erp) {
    return
  }
  // 单例：同账号且连接存活则只更新回调
  if (socket && erp === currentErp
    && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return
  }
  // 切换账号时关闭旧连接（先置空 erp 避免旧连接触发重连）
  if (socket) {
    currentErp = null
    try {
      socket.close()
    } catch (e) {
      // ignore
    }
  }
  currentErp = erp
  connect()
}

/**
 * 主动关闭连接（登出时调用，不会触发重连）
 */
export function closeSocket() {
  currentErp = null
  stopHeartbeat()
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (socket) {
    try {
      socket.close()
    } catch (e) {
      // ignore
    }
    socket = null
  }
}
