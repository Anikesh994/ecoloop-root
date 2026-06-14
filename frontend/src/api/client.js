import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Add auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ecoloop_token')
  if (token && token !== 'demo_token') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ecoloop_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (email, password, full_name) => api.post('/api/v1/auth/register', { email, password, full_name }),
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  me: () => api.get('/api/v1/auth/me'),
}

// Returns
export const returnsAPI = {
  create: (formData) => api.post('/api/v1/returns/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  list: (params) => api.get('/api/v1/returns/', { params }),
  get: (returnId) => api.get(`/api/v1/returns/${returnId}`),
}

// Marketplace
export const marketplaceAPI = {
  browse: (params) => api.get('/api/v1/marketplace/', { params }),
  purchase: (return_id, apply_credits = 0) => api.post('/api/v1/marketplace/purchase', { return_id, apply_credits }),
  joinWaitlist: (data) => api.post('/api/v1/marketplace/waitlist', data),
  myWaitlist: () => api.get('/api/v1/marketplace/waitlist'),
}

// P2P
export const p2pAPI = {
  create: (data) => api.post('/api/v1/p2p/listings', data),
  browse: (params) => api.get('/api/v1/p2p/listings', { params }),
  buy: (listingId) => api.post(`/api/v1/p2p/listings/${listingId}/buy`),
  delete: (listingId) => api.delete(`/api/v1/p2p/listings/${listingId}`),
}

// Credits
export const creditsAPI = {
  balance: () => api.get('/api/v1/credits/balance'),
  history: (params) => api.get('/api/v1/credits/history', { params }),
  leaderboard: () => api.get('/api/v1/credits/leaderboard'),
  redeem: (credits) => api.post('/api/v1/credits/redeem', { credits }),
}

// Predictions
export const predictionsAPI = {
  check: (product_name, category, price) => api.post('/api/v1/predictions/check', { product_name, category, price }),
  history: () => api.get('/api/v1/predictions/history'),
}

// Analytics
export const analyticsAPI = {
  summary: () => api.get('/api/v1/analytics/summary'),
  environmental: () => api.get('/api/v1/analytics/environmental'),
}

export default api