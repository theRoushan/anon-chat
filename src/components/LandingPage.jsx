import React from 'react'
import { useNavigate } from 'react-router-dom'
import useOnlineUsers from '../hooks/useOnlineUsers'
import { 
  MessageCircle, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  ArrowRight,
  Star
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { onlineCount, isLoading } = useOnlineUsers(15000) // Update every 15 seconds

  const handleStartChat = () => {
    navigate('/chat')
  }
  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Instant Anonymous Chat Room",
      description: "Start anonymous chat with strangers immediately. No registration, no personal information required. Join our anonymous chat rooms now."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Pairing",
      description: "Our smart algorithm pairs you with someone new in seconds. No waiting, no delays."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Anonymous Chat",
      description: "Your identity stays completely private. Chat anonymously with strangers without revealing who you are. Secure anonymous messaging."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Anonymous Chat",
      description: "Connect with strangers from around the world in anonymous chat rooms. Discover new perspectives and cultures through anonymous conversations."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Safe Anonymous Chat",
      description: "Built-in moderation and safety features ensure a positive anonymous chat experience. Chat with strangers safely and securely."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Meaningful Anonymous Connections",
      description: "Find friendship, support, or just have fun anonymous conversations with interesting strangers. Build connections through anonymous chat."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Student",
      content: "I love how I can chat with strangers anonymously without any pressure. The anonymous chat conversations are always interesting!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Designer",
      content: "Perfect for when I need a break from work. Quick anonymous chat with strangers, surprisingly meaningful conversations.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Writer",
      content: "As an introvert, this gives me a safe way to practice socializing through anonymous chat. The anonymity makes it comfortable.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ChatAnon</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Anonymous Chat
              </span>
              <br />
              with Strangers Online
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of users in our anonymous chat rooms. Chat with strangers online safely and securely. 
              No registration required, no personal information shared. Start anonymous conversations instantly!
            </p>
            <div className="flex justify-center items-center">
              <button
                onClick={handleStartChat}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Anonymous Chat</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              {!isLoading && `${onlineCount} users online now`} • 100% Free • No Registration Required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Best Anonymous Chat Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the safest and most secure anonymous chat with strangers online. Join our global community today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-xl border border-gray-600 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-blue-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {isLoading ? '...' : onlineCount}
              </div>
              <div className="text-gray-300">Online Now</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-300">Total Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">1M+</div>
              <div className="text-gray-300">Messages Sent</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Anonymous Chat Reviews
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of satisfied users who've found meaningful connections through anonymous chat with strangers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-700 to-gray-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Anonymous Chat?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users in anonymous chat rooms. Chat with strangers online safely and securely. All completely anonymous.
          </p>
          <button
            onClick={handleStartChat}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Start Anonymous Chat Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ChatAnon</span>
              </div>
              <p className="text-gray-400">
                The best anonymous chat platform to connect with strangers online. Safe, secure, and completely free anonymous chat rooms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Anonymous Chat with Strangers</li>
                <li>Anonymous Chat Rooms</li>
                <li>Safe Anonymous Chat</li>
                <li>No Registration Required</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Safety Guidelines</li>
                <li>Report Issues</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Community Guidelines</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ChatAnon. All rights reserved. Built with ❤️ for meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
