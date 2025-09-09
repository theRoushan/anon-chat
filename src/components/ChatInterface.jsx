import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, PhoneOff, Users, Loader2, MessageCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import useWebSocket from '../hooks/useWebSocket'
import useOnlineUsers from '../hooks/useOnlineUsers'
import UserManager from '../utils/userManager'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isPaired, setIsPaired] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const messagesEndRef = useRef(null)
  
  const navigate = useNavigate()
  
  // Use API as fallback for online count when not connected
  const { onlineCount: apiOnlineCount } = useOnlineUsers(30000) // Update every 30 seconds

  const {
    socket,
    connect,
    disconnect,
    sendMessage,
    connectionState
  } = useWebSocket({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws',
    onMessage: handleWebSocketMessage,
    onConnect: handleWebSocketConnect,
    onDisconnect: handleWebSocketDisconnect,
    onError: handleWebSocketError
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle WebSocket messages
  function handleWebSocketMessage(data) {
    try {
      const message = JSON.parse(data)
      console.log('📨 [FRONTEND] Received WebSocket message:', message)
      
      switch (message.type) {
        case 'connected':
          console.log('📨 [FRONTEND] Received connected message')
          setIsConnected(true)
          setIsWaiting(true)
          setOnlineCount(message.onlineCount || 0)
          // Don't add the connection message to chat
          break
          
        case 'user_data_saved':
          console.log('📨 [FRONTEND] User data saved successfully:', message)
          break
          
        case 'online_count_update':
          console.log('📨 [FRONTEND] Online count update:', message.count)
          setOnlineCount(message.count)
          break
          
        case 'paired':
          setIsPaired(true)
          setIsWaiting(false)
          setOnlineCount(message.onlineCount || onlineCount)
          // Clear previous chat history and start fresh with welcome message
          setMessages([
            {
              id: Date.now() - 1,
              type: 'system',
              content: 'ChatAnon: For users 18+ only. Avoid sharing personal information, as chats may be downloaded or shared online by others.',
              timestamp: new Date().toISOString()
            },
            {
              id: Date.now(),
              type: 'system',
              content: "You're now chatting with a stranger. Say hi :)",
              timestamp: new Date().toISOString()
            }
          ])
          break
          
        case 'chat_message':
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: message.from,
            content: message.content,
            timestamp: message.timestamp
          }])
          break
          
        case 'partner_disconnected':
          setIsPaired(false)
          setIsWaiting(false)
          setOnlineCount(message.onlineCount || onlineCount)
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'system',
            content: message.message,
            timestamp: new Date().toISOString()
          }])
          // Automatically disconnect the remaining user
          disconnect()
          break
          
        case 'error':
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'error',
            content: message.message,
            timestamp: new Date().toISOString()
          }])
          break
          
        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  function handleWebSocketConnect(ws) {
    console.log('🔌 [FRONTEND] WebSocket connected')
    setIsConnected(true)
    
    // Debug: Check user data before sending
    const userData = UserManager.getUserData()
    console.log('🔌 [FRONTEND] WebSocket connected, user data:', userData)
    
    if (!userData.userId) {
      console.error('❌ [FRONTEND] No userId found in user data!')
      return
    }
    
    if (!userData.gender) {
      console.error('❌ [FRONTEND] No gender found in user data!')
      return
    }
    
    // Send user data immediately using the WebSocket instance
    console.log('🔌 [FRONTEND] Sending user data via WebSocket...')
    const success = UserManager.sendUserDataViaWebSocket(ws)
    console.log('🔌 [FRONTEND] User data sent via WebSocket:', success)
  }

  function handleWebSocketDisconnect() {
    setIsConnected(false)
    setIsPaired(false)
    setIsWaiting(false)
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: 'Connection lost. Click "Start Chat" to reconnect.',
      timestamp: new Date().toISOString()
    }])
  }

  function handleWebSocketError(error) {
    console.error('WebSocket error:', error)
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'error',
      content: 'Connection error. Please try again.',
      timestamp: new Date().toISOString()
    }])
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || !isPaired) return
    
    const message = inputMessage.trim()
    sendMessage(message)
    setInputMessage('')
  }

  const handleDisconnect = () => {
    if (!showDisconnectConfirm) {
      // First click - show confirmation
      setShowDisconnectConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setShowDisconnectConfirm(false)
      }, 3000)
    } else {
      // Second click - actually disconnect
      disconnect()
      setMessages([])
      setIsPaired(false)
      setIsWaiting(false)
      setShowDisconnectConfirm(false)
    }
  }

  const handleStartChat = () => {
    // Check if user has complete data before connecting
    if (!UserManager.hasCompleteUserData()) {
      console.error('Cannot start chat: User data is incomplete')
      return
    }
    
    // Clear any previous chat history and add welcome message when starting new chat
    setMessages([
      {
        id: Date.now() - 1,
        type: 'system',
        content: 'chatAnon.com: For users 18+ only. Avoid sharing personal information, as chats may be downloaded or shared online by others.',
        timestamp: new Date().toISOString()
      },
      {
        id: Date.now(),
        type: 'system',
        content: "You're now chatting with a stranger. Say hi :)",
        timestamp: new Date().toISOString()
      }
    ])
    
    // Connect WebSocket - user data will be sent immediately after connection
    connect()
  }

  const handleBackToLanding = () => {
    // Disconnect from chat and return to landing page
    disconnect()
    setMessages([])
    setIsPaired(false)
    setIsWaiting(false)
    setIsConnected(false)
    navigate('/')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Fixed Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToLanding}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">ChatAnon</h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{isConnected ? onlineCount : apiOnlineCount} online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          {/* Disconnect/Start Button */}
          <button
            type="button"
            onClick={isConnected ? handleDisconnect : handleStartChat}
            className={`flex items-center space-x-2 flex-shrink-0 ${
              isConnected 
                ? (showDisconnectConfirm ? 'bg-orange-500 hover:bg-orange-600' : 'btn-danger')
                : 'btn-primary'
            } text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isConnected ? (
              <>
                <PhoneOff className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {showDisconnectConfirm ? 'Really?' : 'Disconnect'}
                </span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Start</span>
              </>
            )}
          </button>
          
          {/* Message Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              !isConnected 
                ? "Start chat to begin messaging..." 
                : isPaired 
                  ? "Type your message..." 
                  : "Waiting for a stranger..."
            }
            className="input-field flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={1000}
            disabled={!isPaired}
          />
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isPaired}
            className="btn-primary flex items-center space-x-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* Scrollable Content Area */}
      <main className="flex-1 pt-20 pb-24 overflow-hidden">
        <div className="h-full bg-gray-800 overflow-y-auto">
          <div className="p-4 space-y-1">
            {messages.length === 0 && !isWaiting && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Welcome to Anonymous Chat
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Click "Start Chat" to begin talking with a random stranger
                  </p>
                  <button
                    onClick={handleStartChat}
                    className="btn-primary text-lg px-8 py-3"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            )}

            {isWaiting && isConnected && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Looking for a stranger...
                  </h2>
                  <p className="text-gray-300">
                    Please wait while we find someone to chat with
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatInterface
