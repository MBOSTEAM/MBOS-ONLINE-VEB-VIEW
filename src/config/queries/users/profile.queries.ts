import { axiosPrivate } from '@/config/api/api'
import { userEndpoints } from '@/config/api/endpoint'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { showSuccess, showError } from '@/shared/utils/notifications'

export interface ApiResponse<T> {
    success: boolean
    data: T
}

export interface UserProfile {
    userId: string
    phone_number: string
    full_name: string | null
    avatar: string | null
    created_at?: string
    stats?: {
        total_orders: number
        total_spent: number
        favorite_stations: number
    }
}

export interface UpdateProfileRequest {
    full_name?: string | null
    avatar?: string | null
    region_id?: string | null
    district_id?: string | null
}

export interface UpdateProfileResponse {
    userId: string
    avatar: string | null
    full_name: string | null
    phone_number: string
}

export interface UpdatePhoneRequest {
    phone_number: string
}

export interface UpdatePhoneResponse {
    verification_token: string
    phone_number: string
    expire_after: number
}

export interface VerifyPhoneRequest {
    code: string
    verification_token: string
}

export interface VerifyPhoneResponse {
    userId: string
    avatar: string | null
    full_name: string | null
    phone_number: string
}

export const useUserProfile = () => {
    return useQuery({
        queryKey: [userEndpoints.profile],
        queryFn: async (): Promise<ApiResponse<UserProfile>> => {
            const { data } = await axiosPrivate.get<ApiResponse<UserProfile>>(
                userEndpoints.profile
            )
            return data
        }
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>> => {
            const { data } = await axiosPrivate.patch<ApiResponse<UpdateProfileResponse>>(
                userEndpoints.profile,
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [userEndpoints.profile] })
            showSuccess('Profil muvaffaqiyatli yangilandi')
        },
        onError: () => {
            showError('Profilni yangilashda xatolik yuz berdi')
        }
    })
}

export const useUpdatePhoneNumber = () => {
    return useMutation({
        mutationFn: async (request: UpdatePhoneRequest): Promise<ApiResponse<UpdatePhoneResponse>> => {
            const { data } = await axiosPrivate.put<ApiResponse<UpdatePhoneResponse>>(
                userEndpoints.updatePhone,
                request
            )
            return data
        },
        onSuccess: () => {
            showSuccess('Telefon raqami o\'zgartirish kodi yuborildi')
        },
        onError: () => {
            showError('Telefon raqamni o\'zgartirishda xatolik yuz berdi')
        }
    })
}

export const useVerifyPhoneNumber = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: VerifyPhoneRequest): Promise<ApiResponse<VerifyPhoneResponse>> => {
            const { data } = await axiosPrivate.put<ApiResponse<VerifyPhoneResponse>>(
                userEndpoints.verifyPhone,
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [userEndpoints.profile] })
            showSuccess('Telefon raqami muvaffaqiyatli tasdiqlandi')
        },
        onError: () => {
            showError('Telefon raqamni tasdiqlashda xatolik yuz berdi')
        }
    })
}

