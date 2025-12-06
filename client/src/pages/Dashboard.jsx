import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import Card from '../components/Card'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Button from '../components/Button'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/dashboard')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Let's cook something amazing today.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'My Recipes', value: stats?.recipeCount || 0, icon: '📝' },
          { label: 'Comments Made', value: stats?.commentCount || 0, icon: '💬' },
          { label: 'Last Activity', value: stats?.lastActivity || 'N/A', icon: '🕐' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI Recipe Generator</h3>
              <p className="text-gray-600 mb-4">
                Use AI to create recipes. Upload ingredient photos or list them manually to get AI-powered recipe suggestions.
              </p>
              <Link to="/ai-generator">
                <Button className="w-full">Generate Recipe</Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-3">My Recipes</h3>
              <p className="text-gray-600 mb-4">
                View saved recipes. Browse through your collection of saved and favorited recipes.
              </p>
              <Link to="/recipes">
                <Button variant="secondary" className="w-full">View Recipes</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard


