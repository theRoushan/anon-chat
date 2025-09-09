import { useState, useEffect, useRef, useCallback } from 'react'

const useWebSocket = ({ url, onMessage, onConnect, onDisconnect, onError }) => {
  const [socket, setSocket] = useState(null)
  const [connectionState, setConnectionState] = useState('disconnected')
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  const connect = useCallback(() => {
    // If socket exists and is open, don't create a new connection
    if (socket && socket.readyState === WebSocket.OPEN) {
      return
    }

    // If socket exists but is closed, clean it up first
    if (socket && socket.readyState !== WebSocket.OPEN) {
      socket.close()
      setSocket(null)
    }

    try {
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setSocket(ws)
        setConnectionState('connected')
        reconnectAttemptsRef.current = 0
        onConnect?.(ws)
      }

      ws.onmessage = (event) => {
        onMessage?.(event.data)
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setSocket(null)
        setConnectionState('disconnected')
        onDisconnect?.()

        // Attempt to reconnect if not a manual disconnect
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay * reconnectAttemptsRef.current)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionState('error')
        onError?.(error)
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      onError?.(error)
    }
  }, [url, onMessage, onConnect, onDisconnect, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (socket) {
      socket.close(1000, 'Manual disconnect')
      setSocket(null)
      setConnectionState('disconnected')
    }
  }, [socket])

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'chat_message',
        content: message
      }
      socket.send(JSON.stringify(messageData))
    } else {
      console.error('WebSocket is not connected')
    }
  }, [socket])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socket) {
        socket.close()
      }
    }
  }, [socket])

  return {
    socket,
    connectionState,
    connect,
    disconnect,
    sendMessage
  }
}

export default useWebSocket
