import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
const axiosPrivate = axios.create({
	baseURL
})

// Get user location from localStorage or use default
const getUserLocation = () => {
	// Check if location exists in localStorage
	const savedLocation = localStorage.getItem('userLocation')
	
	if (savedLocation) {
		try {
			const { latitude, longitude } = JSON.parse(savedLocation)
			return { latitude, longitude }
		} catch (e) {
			console.error('Error parsing saved location:', e)
		}
	}
	
	// Default location (Tashkent, Uzbekistan)
	return {
		latitude: '41.3111',
		longitude: '69.2797'
	}
}

axiosPrivate.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		
		// Add location headers
		const { latitude, longitude } = getUserLocation()
		config.headers['X-Latitude'] = latitude
		config.headers['X-Longitude'] = longitude
		
		// Add other standard headers
		config.headers['X-Device-Type'] = 'web'
		config.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tashkent'
		
		return config
	},
	error => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
	response => response,

	async error => {
		const originalRequest = error.config

		// Token expired - refresh logic
		if (
			error.response?.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true

			const refreshToken = localStorage.getItem('refreshToken')
			
			if (!refreshToken) {
				localStorage.removeItem('accessToken')
				window.location.href = '/login'
				return Promise.reject(error)
			}

			try {
				// Create a new axios instance without interceptor to avoid infinite loop
				const refreshAxios = axios.create({ baseURL })
				
				const refreshResponse = await refreshAxios.post('/api/v1/auth/refresh', {
					refresh_token: refreshToken
				})

				if (refreshResponse?.data?.data?.access_token) {
					const newAccessToken = refreshResponse.data.data.access_token
					const newRefreshToken = refreshResponse.data.data.refresh_token
					
					localStorage.setItem('accessToken', newAccessToken)
					if (newRefreshToken) {
						localStorage.setItem('refreshToken', newRefreshToken)
					}
					
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
					return axiosPrivate(originalRequest)
				}
			} catch (err) {
				console.error('Error refreshing token:', err)
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
				window.location.href = '/login'
				return Promise.reject(err)
			}
		}

		// Password change required
		if (
			error.response?.status === 405 &&
			error.response?.data?.message === 'Password Change Requierd'
		) {
			return Promise.reject(error)
		}

		// Other 401 errors - logout
		if (error.response?.status === 401 && !originalRequest._retry) {
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
			window.location.href = '/login'
		}

		return Promise.reject(error)
	}
)

export {  axiosPrivate }