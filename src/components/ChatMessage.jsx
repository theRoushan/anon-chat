import React from 'react'

const ChatMessage = ({ message }) => {
  const getSenderLabel = (type) => {
    switch (type) {
      case 'you':
        return 'You'
      case 'stranger':
        return 'Stranger'
      default:
        return ''
    }
  }

  const getSenderColor = (type) => {
    switch (type) {
      case 'you':
        return 'text-blue-600'
      case 'stranger':
        return 'text-red-600'
      default:
        return 'text-gray-400'
    }
  }

  // For system and error messages, show them centered with different styling
  if (message.type === 'system' || message.type === 'error') {
    return (
      <div className="flex justify-center my-1">
        <div className={`text-sm text-center px-4 py-2 rounded-lg max-w-md ${
          message.type === 'error' 
            ? 'bg-red-900 text-red-300' 
            : 'bg-gray-700 text-gray-300'
        }`}>
          {message.content}
        </div>
      </div>
    )
  }

  // For regular chat messages, use simple text format
  return (
    <div className="py-0.1">
      <span className={`font-medium ${getSenderColor(message.type)}`}>
        {getSenderLabel(message.type)}:
      </span>
      <span className="text-white ml-1">
        {message.content}
      </span>
    </div>
  )
}

export default ChatMessage
