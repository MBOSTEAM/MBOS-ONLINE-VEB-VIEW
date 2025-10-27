import { axiosPrivate } from '../../api/api'
import { userEndpoints } from '../../api/endpoint'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { showSuccess, showError } from '../../../shared/utils/notifications'

export interface ApiResponse<T> {
    success: boolean
    data: T
}

export interface UserProfile {
    id: string
    phone: string
    full_name: string
    avatar_url: string
    created_at: string
    stats?: {
        total_orders: number
        total_spent: number
        favorite_stations: number
    }
}

export interface UpdateProfileRequest {
    full_name?: string
    avatar?: string
}

export interface UpdateProfileResponse {
    id: string
    full_name: string
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

