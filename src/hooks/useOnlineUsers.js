import { useState, useEffect } from 'react'

const useOnlineUsers = (interval = 10000) => {
  const [onlineCount, setOnlineCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const generateMockOnlineCount = () => {
    // Generate random number between 5000 and 6000
    const min = 5000
    const max = 6000
    const randomCount = Math.floor(Math.random() * (max - min + 1)) + min
    console.log('🎭 [useOnlineUsers] Generated mock online count:', randomCount)
    return randomCount
  }

  const fetchOnlineCount = async () => {
    try {
      // Mock the API call with a random number between 5000-6000
      const mockCount = generateMockOnlineCount()
      setOnlineCount(mockCount)
      setError(null)
    } catch (err) {
      console.error('❌ [useOnlineUsers] Mock error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchOnlineCount()

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchOnlineCount, interval)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [interval])

  return {
    onlineCount,
    isLoading,
    error,
    refetch: fetchOnlineCount
  }
}

export default useOnlineUsers
