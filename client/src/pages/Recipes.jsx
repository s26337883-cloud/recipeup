import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import Card from '../components/Card'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Button from '../components/Button'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes')
      setRecipes(response.data.recipes || [])
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRecipes()
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`/search?q=${encodeURIComponent(searchTerm)}`)
      setRecipes(response.data.recipes || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && recipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Recipes</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search recipes..."
            className="input-field flex-1"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </motion.div>

      {recipes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No recipes found.</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.ingredients?.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {recipe.author?.name || 'Unknown'}</span>
                  <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/recipes/${recipe.id}`}>
                  <Button variant="secondary" className="w-full">View Recipe</Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recipes


