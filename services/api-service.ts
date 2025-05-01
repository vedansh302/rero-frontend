import axios from "axios"

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", { name, email, password })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/user/me")
    return response.data
  },

  updateProfile: async (userData: any) => {
    const response = await api.put("/user/profile", userData)
    return response.data
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put("/user/password", { currentPassword, newPassword })
    return response.data
  },

  updateProfilePicture: async (formData: FormData) => {
    const response = await api.post("/user/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}

// Energy analysis services
export const energyService = {
  analyzeEnergy: async (data: {
    location: string
    consumption: number
    area: number
    propertyType?: string
    budget?: string
  }) => {
    const response = await api.post("/energy/analyze", data)
    return response.data
  },

  getUserAnalysisHistory: async () => {
    const response = await api.get("/user/analysis-history")
    return response.data
  },

  getAnalysisDetails: async (analysisId: string) => {
    const response = await api.get(`/user/analysis/${analysisId}`)
    return response.data
  },
}

// Weather services
export const weatherService = {
  getCurrentWeather: async (location: string) => {
    const response = await api.get(`/energy/weather?location=${encodeURIComponent(location)}`)
    return response.data
  },
}

export default api
