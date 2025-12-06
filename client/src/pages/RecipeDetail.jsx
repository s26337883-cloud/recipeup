import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { toast } from 'react-toastify'
import Card from '../components/Card'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Button from '../components/Button'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipe()
    fetchComments()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`)
      setRecipe(response.data.recipe)
    } catch (error) {
      toast.error('Failed to load recipe')
      navigate('/recipes')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await api.get(`/recipes/${id}/comments`)
      setComments(response.data.comments || [])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to comment')
      navigate('/login')
      return
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      await api.post(`/recipes/${id}/comments`, { comment: commentText })
      toast.success('Comment added!')
      setCommentText('')
      fetchComments()
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="mb-8">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <span>By {recipe.author?.name || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">Ingredients</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700">{recipe.ingredients}</pre>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Steps</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700">{recipe.steps}</pre>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
          
          {user && (
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input-field mb-3"
                rows="3"
                placeholder="Add a comment..."
              />
              <Button type="submit">Post Comment</Button>
            </form>
          )}

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-primary-500 pl-4 py-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{comment.commenter?.name || 'Unknown'}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.commentText}</p>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default RecipeDetail


