import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { toast } from 'react-toastify'
import Card from '../components/Card'
import Button from '../components/Button'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile')
      setProfile(response.data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
          <p className="text-gray-600 mb-8">Manage your account information</p>

          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Profile


