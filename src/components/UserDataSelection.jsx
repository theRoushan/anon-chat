import React, { useState } from 'react'
import { Users, Heart, Gamepad2, Music, Camera, BookOpen, Coffee, Plane, Palette, Code } from 'lucide-react'
import UserManager from '../utils/userManager'

const UserDataSelection = ({ onComplete }) => {
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedInterests, setSelectedInterests] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const interests = [
    { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'music', label: 'Music', icon: <Music className="w-5 h-5" /> },
    { id: 'photography', label: 'Photography', icon: <Camera className="w-5 h-5" /> },
    { id: 'reading', label: 'Reading', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'coffee', label: 'Coffee', icon: <Coffee className="w-5 h-5" /> },
    { id: 'travel', label: 'Travel', icon: <Plane className="w-5 h-5" /> },
    { id: 'art', label: 'Art', icon: <Palette className="w-5 h-5" /> },
    { id: 'programming', label: 'Programming', icon: <Code className="w-5 h-5" /> }
  ]

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender)
  }

  const handleInterestToggle = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId)
      } else {
        return [...prev, interestId]
      }
    })
  }

  const handleSubmit = async () => {
    if (!selectedGender) {
      alert('Please select your gender')
      return
    }

    setIsSubmitting(true)

    try {
      // Save to cache first - this will generate userId if it doesn't exist
      UserManager.setUserData(selectedGender, selectedInterests)
      
      // Get the generated userId
      const userId = UserManager.getUserId()
      console.log('Generated userId:', userId)
      
      // Send to backend (write-only)
      const result = await UserManager.sendUserDataToBackend()
      
      if (result.success) {
        console.log('User data saved successfully with userId:', userId)
        onComplete()
      } else {
        console.error('Failed to save user data:', result.error)
        // Still proceed even if backend save fails
        onComplete()
      }
    } catch (error) {
      console.error('Error saving user data:', error)
      // Still proceed even if there's an error
      onComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Tell us about yourself
          </h2>
          <p className="text-gray-300">
            This helps us match you with compatible chat partners
          </p>
        </div>

        {/* Gender Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Select your gender</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleGenderSelect('male')}
              className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                selectedGender === 'male'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>Male</span>
            </button>
            <button
              onClick={() => handleGenderSelect('female')}
              className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                selectedGender === 'female'
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>Female</span>
            </button>
          </div>
        </div>

        {/* Interests Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Select your interests (optional)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className={`p-4 rounded-lg font-medium transition-all duration-200 flex flex-col items-center space-y-2 ${
                  selectedInterests.includes(interest.id)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {interest.icon}
                <span className="text-sm">{interest.label}</span>
              </button>
            ))}
          </div>
          {selectedInterests.length > 0 && (
            <p className="text-sm text-gray-400 mt-3">
              Selected: {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedGender || isSubmitting}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
              selectedGender && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Start Chatting</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your data is stored locally and used only for matching. We never share your personal information.
        </p>
      </div>
    </div>
  )
}

export default UserDataSelection
