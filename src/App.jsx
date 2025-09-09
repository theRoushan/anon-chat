import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ChatInterface from './components/ChatInterface'
import UserDataSelection from './components/UserDataSelection'
import UserManager from './utils/userManager'

function App() {
  const [showUserDataSelection, setShowUserDataSelection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeUser = () => {
      const hasCompleteData = UserManager.hasCompleteUserData()
      
      if (!hasCompleteData) {
        // New user or incomplete data, show selection
        setShowUserDataSelection(true)
      } else {
        // User has complete data, proceed to chat
        setShowUserDataSelection(false)
      }
      
      setIsLoading(false)
    }

    initializeUser()
  }, [])

  const handleUserDataComplete = () => {
    setShowUserDataSelection(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={
          showUserDataSelection ? 
            <UserDataSelection onComplete={handleUserDataComplete} /> : 
            <ChatInterface />
        } />
      </Routes>
    </Router>
  )
}

export default App
