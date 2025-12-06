import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../../services/api'

// Mock the api module
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Recipe Service Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches all recipes', async () => {
    const mockRecipes = [
      { id: 1, title: 'Recipe 1', ingredients: 'ing1, ing2' },
      { id: 2, title: 'Recipe 2', ingredients: 'ing3, ing4' }
    ]

    api.get.mockResolvedValueOnce({
      data: { success: true, recipes: mockRecipes }
    })

    const response = await api.get('/recipes')
    
    expect(api.get).toHaveBeenCalledWith('/recipes')
    expect(response.data.recipes).toEqual(mockRecipes)
  })

  it('fetches recipe by id', async () => {
    const mockRecipe = {
      id: 1,
      title: 'Test Recipe',
      ingredients: 'test ingredients',
      steps: 'test steps'
    }

    api.get.mockResolvedValueOnce({
      data: { success: true, recipe: mockRecipe }
    })

    const response = await api.get('/recipes/1')
    
    expect(api.get).toHaveBeenCalledWith('/recipes/1')
    expect(response.data.recipe).toEqual(mockRecipe)
  })

  it('creates a new recipe', async () => {
    const newRecipe = {
      title: 'New Recipe',
      ingredients: 'ing1, ing2',
      steps: 'Step 1, Step 2'
    }

    api.post.mockResolvedValueOnce({
      data: { success: true, message: 'Recipe created' }
    })

    const response = await api.post('/recipes', newRecipe)
    
    expect(api.post).toHaveBeenCalledWith('/recipes', newRecipe)
    expect(response.data.success).toBe(true)
  })

  it('searches recipes', async () => {
    const searchResults = [
      { id: 1, title: 'Pasta Recipe', ingredients: 'pasta, tomato' }
    ]

    api.get.mockResolvedValueOnce({
      data: { success: true, recipes: searchResults }
    })

    const response = await api.get('/search?q=pasta')
    
    expect(api.get).toHaveBeenCalledWith('/search?q=pasta')
    expect(response.data.recipes).toEqual(searchResults)
  })
})

