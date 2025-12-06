import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            Welcome to SmartMeal AI
          </motion.h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered cooking assistant. Discover amazing recipes, share your favorites, and let AI help you create delicious meals.
          </p>
          {user ? (
            <div className="flex justify-center space-x-4">
              <Link to="/add-recipe">
                <Button>Share a Recipe</Button>
              </Link>
              <Link to="/ai-generator">
                <Button variant="secondary">Try AI Generator</Button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button>Join Now</Button>
              </Link>
              <Link to="/recipes">
                <Button variant="secondary">Browse Recipes</Button>
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {[
            {
              icon: '🤖',
              title: 'AI Recipe Generator',
              description: 'Get personalized recipe suggestions based on your ingredients using advanced AI technology.'
            },
            {
              icon: '🍳',
              title: 'Share Recipes',
              description: 'Share your favorite recipes with the community and discover new culinary ideas.'
            },
            {
              icon: '👥',
              title: 'Connect & Comment',
              description: 'Engage with other food lovers, comment on recipes, and build your cooking community.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Home


