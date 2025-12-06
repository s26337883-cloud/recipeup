import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import { toast } from 'react-toastify'
import Card from '../components/Card'
import Button from '../components/Button'

const AddRecipe = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    steps: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.ingredients || !formData.steps) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await api.post('/recipes', formData)
      toast.success('Recipe added successfully!')
      navigate('/recipes')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter recipe title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients *
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="input-field"
                rows="6"
                placeholder="List ingredients (one per line or separated by commas)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Steps *
              </label>
              <textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="input-field"
                rows="8"
                placeholder="Describe the cooking steps"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Adding Recipe...' : 'Add Recipe'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/recipes')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default AddRecipe


