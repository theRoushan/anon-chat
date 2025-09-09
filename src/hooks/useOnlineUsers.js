import { useState, useEffect } from 'react'

const useOnlineUsers = (interval = 10000) => {
  const [onlineCount, setOnlineCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOnlineCount = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${baseUrl}/api/users/online`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setOnlineCount(data.count)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch online users count:', err)
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
