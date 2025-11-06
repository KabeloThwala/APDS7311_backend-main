import axios from 'axios'

const baseURL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  import.meta.env?.VITE_API_URL ||
  'https://localhost:5000/api'

const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 20000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.message || err.message || 'Request failed'
    console.warn('[API]', msg)
    return Promise.reject(err)
  }
)

export default api
