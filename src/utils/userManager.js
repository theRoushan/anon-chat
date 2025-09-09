class UserManager {
  constructor() {
    this.userId = null
    this.gender = null
    this.interests = []
  }

  // Get user ID from cache only (don't generate if not exists)
  getUserId() {
    if (!this.userId) {
      this.userId = localStorage.getItem('chatAnon_userId')
    }
    
    return this.userId
  }

  // Get gender from cache only
  getGender() {
    if (!this.gender) {
      this.gender = localStorage.getItem('chatAnon_gender')
    }
    return this.gender
  }

  // Get interests from cache only
  getInterests() {
    if (!this.interests || this.interests.length === 0) {
      const stored = localStorage.getItem('chatAnon_interests')
      this.interests = stored ? JSON.parse(stored) : []
    }
    return this.interests
  }

  // Save gender to cache only
  setGender(gender) {
    this.gender = gender
    localStorage.setItem('chatAnon_gender', gender)
  }

  // Save interests to cache only
  setInterests(interests) {
    this.interests = interests
    localStorage.setItem('chatAnon_interests', JSON.stringify(interests))
  }

  // Save complete user data to cache and generate userId if not exists
  setUserData(gender, interests) {
    // Generate userId if it doesn't exist yet
    if (!this.userId) {
      this.userId = this.generateUserId()
      localStorage.setItem('chatAnon_userId', this.userId)
    }
    
    this.setGender(gender)
    this.setInterests(interests)
  }

  // Check if user has complete data
  hasCompleteUserData() {
    return this.getUserId() && this.getGender()
  }

  // Check if user has userId (for determining if user data has been saved)
  hasUserId() {
    return !!this.getUserId()
  }

  // Get all user data from cache
  getUserData() {
    return {
      userId: this.getUserId(),
      gender: this.getGender(),
      interests: this.getInterests()
    }
  }

  // Generate unique user ID using crypto.randomUUID (similar to backend uuidv4)
  generateUserId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    } else {
      // Fallback for older browsers
      return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
  }

  // Get browser information
  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  // Clear user data (for testing)
  clearUserData() {
    localStorage.removeItem('chatAnon_userId')
    localStorage.removeItem('chatAnon_gender')
    localStorage.removeItem('chatAnon_interests')
    this.userId = null
    this.gender = null
    this.interests = []
  }

  // Send user data to backend (write-only)
  async sendUserDataToBackend() {
    const userData = this.getUserData()
    const browserInfo = this.getBrowserInfo()
    
    if (!userData.gender) {
      console.warn('No gender data to send to backend')
      return { success: false, error: 'No gender data' }
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/users/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.userId,
          gender: userData.gender,
          interests: userData.interests,
          ...browserInfo
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('User data saved to backend successfully')
        return { success: true }
      } else {
        console.error('Failed to save user data to backend:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error sending user data to backend:', error)
      return { success: false, error: error.message }
    }
  }

  // Send user data via WebSocket
  sendUserDataViaWebSocket(socket) {
    const userData = this.getUserData()
    const browserInfo = this.getBrowserInfo()
    
    console.log('🔌 [USERMANAGER] sendUserDataViaWebSocket called')
    console.log('🔌 [USERMANAGER] Socket:', socket)
    console.log('🔌 [USERMANAGER] Socket readyState:', socket?.readyState)
    console.log('🔌 [USERMANAGER] User data:', userData)
    
    if (!userData.gender) {
      console.warn('❌ [USERMANAGER] No gender data to send via WebSocket')
      return false
    }

    if (!userData.userId) {
      console.error('❌ [USERMANAGER] No userId available to send via WebSocket')
      return false
    }

    if (!socket) {
      console.error('❌ [USERMANAGER] No socket provided')
      return false
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.error('❌ [USERMANAGER] Socket is not open. ReadyState:', socket.readyState)
      return false
    }

    const message = {
      type: 'user_data',
      userId: userData.userId,
      gender: userData.gender,
      interests: userData.interests,
      language: browserInfo.language,
      timezone: browserInfo.timezone
    }

    console.log('🔌 [USERMANAGER] Sending user data via WebSocket:', message)

    try {
      socket.send(JSON.stringify(message))
      console.log('✅ [USERMANAGER] User data sent successfully')
      return true
    } catch (error) {
      console.error('❌ [USERMANAGER] Error sending user data:', error)
      return false
    }
  }
}

export default new UserManager()
