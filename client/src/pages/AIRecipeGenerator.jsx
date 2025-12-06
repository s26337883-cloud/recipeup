import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { toast } from 'react-toastify'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSkeleton from '../components/LoadingSkeleton'

const AIRecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([])
  const [ingredientInput, setIngredientInput] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  const addIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()])
      setIngredientInput('')
    }
  }

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient))
  }

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/ai/recommend', { ingredients })
      setRecipes(response.data.recipes || [])
      if (response.data.recipes && response.data.recipes.length === 0) {
        toast.info('No recipes found. Try different ingredients.')
      } else {
        toast.success('Recipes generated successfully!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate recipes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Recipe Generator</h1>
          <p className="text-gray-600">Upload ingredients or list them to get AI-powered recipes</p>
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Enter Ingredients</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              className="input-field flex-1"
              placeholder="Enter ingredient name"
            />
            <Button onClick={addIngredient}>Add</Button>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ingredient, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="hover:text-primary-900"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || ingredients.length === 0}
            className="w-full"
          >
            {loading ? 'Generating Recipes...' : 'Generate Recipe'}
          </Button>
        </Card>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {recipes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Recommended Recipes</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {recipes.map((recipe, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                        <p className="text-gray-600 mb-4">{recipe.description || 'AI-generated recipe'}</p>
                        {recipe.ingredients && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Ingredients:</h4>
                            <p className="text-sm text-gray-700">{recipe.ingredients}</p>
                          </div>
                        )}
                        {recipe.steps && (
                          <div>
                            <h4 className="font-semibold mb-2">Steps:</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{recipe.steps}</p>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!loading && recipes.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <p className="text-gray-600">Add ingredients and click 'Generate Recipe' to get started</p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

export default AIRecipeGenerator


