import { axiosPrivate } from '../../api/api'
import { authEndpoints } from '../../api/endpoint'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showSuccess, showError } from '../../../shared/utils/notifications'

export interface SendOtpRequest {
    phone: string
}

export interface SendOtpResponse {
    verification_token: string
    message: string
    expires_in: number
    phone: string
    resend_available_in: number
}

export interface VerifyOtpRequest {
    phone: string
    verification_token: string
    otp: string
}

export interface UserWallet {
    id: string
    balance: number
    currency: string
}

export interface User {
    id: string
    phone: string
    full_name: string
    avatar_url: string
    is_new_user: boolean
    wallet: UserWallet
}

export interface VerifyOtpResponse {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    user: User
}

export interface RefreshTokenRequest {
    refresh_token: string
}

export interface RefreshTokenResponse {
    access_token: string
    refresh_token: string
    expires_in: number
}

export interface LogoutRequest {
    refresh_token: string
}

export interface ApiResponse<T> {
    success: boolean
    data: T
}

export const useSendOtp = () => {
    return useMutation({
        mutationFn: async (phone: string): Promise<ApiResponse<SendOtpResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<SendOtpResponse>>(
                authEndpoints.sendOtp,
                { phone }
            )
            return data
        },
        onSuccess: () => {
            showSuccess('OTP yuborildi')
        },
        onError: () => {
            showError('OTP yuborishda xatolik yuz berdi')
        }
    })
}

export const useVerifyOtp = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<VerifyOtpResponse>>(
                authEndpoints.verifyOtp,
                request
            )
            return data
        },
        onSuccess: (response) => {
            localStorage.setItem('accessToken', response.data.access_token)
            localStorage.setItem('refreshToken', response.data.refresh_token)

            queryClient.setQueryData([authEndpoints.verifyOtp], response.data.user)
            showSuccess('Tizimga muvaffaqiyatli kirdingiz')
        },
        onError: () => {
            showError('OTP tasdiqlashda xatolik yuz berdi')
        }
    })
}

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async (request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<RefreshTokenResponse>>(
                authEndpoints.refresh,
                request
            )
            return data
        },
        onSuccess: (response) => {
            localStorage.setItem('accessToken', response.data.access_token)
            localStorage.setItem('refreshToken', response.data.refresh_token)
        },
        onError: () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            showError('Token yangilashda xatolik yuz berdi')
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (refreshToken: string): Promise<void> => {
            await axiosPrivate.post(authEndpoints.logout, { refresh_token: refreshToken })
        },
        onSuccess: () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            queryClient.clear()
            showSuccess('Tizimdan muvaffaqiyatli chiqdingiz')
        },
        onError: () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            queryClient.clear()
            showError('Chiqishda xatolik yuz berdi')
        }
    })
}

