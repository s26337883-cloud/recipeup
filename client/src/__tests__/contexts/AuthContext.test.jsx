import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}))

const TestComponent = () => {
  const { user, loading, login, register, logout } = useAuth()
  
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div data-testid="user">{user ? user.name : 'No user'}</div>
          <button onClick={() => login('test@example.com', 'password')}>Login</button>
          <button onClick={() => register('Test User', 'test@example.com', 'password')}>Register</button>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        user: { id: 1, name: 'Test User', email: 'test@example.com' }
      }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      })
    })
  })

  it('handles login failure', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        success: false,
        message: 'Invalid credentials'
      }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled()
    })
  })
})

