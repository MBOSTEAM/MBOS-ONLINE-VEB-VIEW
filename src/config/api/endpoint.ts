export const authEndpoints = {
	sendOtp: '/api/v1/auth/send-otp',
	verifyOtp: '/api/v1/auth/verify-otp',
	refresh: '/api/v1/auth/refresh',
	logout: '/api/v1/auth/logout'
} as const

export const userEndpoints = {
	profile: '/api/v1/users/profile',
	updateProfile: '/api/v1/users/auth/profile',
	vehicleParams: '/api/v1/users/vehicle-params',
	vehicles: '/api/v1/users/vehicles',
	vehicle: (id: string) => `/api/v1/users/vehicles/${id}`,
	updatePhone: '/api/v1/users/profile/phone-number',
	verifyPhone: '/api/v1/users/profile/phone-number/verify-otp'
} as const

export const stationEndpoints = {
	all: '/api/v1/stations',
	one: (id: string) => `/api/v1/stations/${id}`,
	timeSlots: (id: string) => `/api/v1/stations/${id}/time-slots`
} as const

export const orderEndpoints = {
	all: '/api/v1/orders',
	one: (id: string) => `/api/v1/orders/${id}`,
	cancel: (id: string) => `/api/v1/orders/${id}/cancel`,
	arrived: (id: string) => `/api/v1/orders/${id}/arrived`
} as const

export const walletEndpoints = {
	wallet: '/api/v1/wallet',
	transactions: '/api/v1/wallet/transactions',
	topup: '/api/v1/wallet/topup'
} as const

export const notificationEndpoints = {
	all: '/api/v1/notifications',
	read: (id: string) => `/api/v1/notifications/${id}/read`,
	registerDevice: '/api/v1/notifications/register-device'
} as const

export const uploadEndpoints = {
	image: '/api/v1/file/upload'
} as const

export const feedbackEndpoints = {
	submitOrderFeedback: (id: string) => `/api/v1/orders/${id}/feedback`,
	serviceFeedback: (id: string) => `/api/v1/services/${id}/feedback`,
	myFeedback: '/api/v1/users/my-feedback',
	one: (id: string) => `/api/v1/feedback/${id}`
} as const

