import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../../services/api'
import axios from 'axios'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  }
}))

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates axios instance with correct base URL', () => {
    expect(axios.create).toHaveBeenCalled()
    const callArgs = axios.create.mock.calls[0][0]
    expect(callArgs.baseURL).toBeDefined()
    expect(callArgs.withCredentials).toBe(true)
  })

  it('sets up request interceptor', () => {
    const instance = axios.create()
    expect(instance.interceptors.request.use).toHaveBeenCalled()
  })

  it('sets up response interceptor', () => {
    const instance = axios.create()
    expect(instance.interceptors.response.use).toHaveBeenCalled()
  })
})

