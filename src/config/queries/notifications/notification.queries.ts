import { axiosPrivate } from '../../api/api'
import { notificationEndpoints } from '../../api/endpoint'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { showSuccess, showError } from '../../../shared/utils/notifications'

export interface ApiResponse<T> {
    success: boolean
    data: T
}

export interface PaginatedApiResponse<T> {
    success: boolean
    data: T
    pagination: {
        page: number
        limit: number
        total: number
        total_pages: number
    }
    unread_count?: number
}

export interface NotificationData {
    order_id?: string
    action?: string
    [key: string]: any
}

export interface Notification {
    id: string
    type: string
    title: string
    body: string
    data: NotificationData
    is_read: boolean
    created_at: string
}

export interface RegisterDeviceRequest {
    device_token: string
    device_type: string
    device_id: string
}

export interface RegisterDeviceResponse {
    message: string
}

export const useNotifications = () => {
    return useQuery({
        queryKey: [notificationEndpoints.all],
        queryFn: async (): Promise<PaginatedApiResponse<Notification[]>> => {
            const { data } = await axiosPrivate.get<PaginatedApiResponse<Notification[]>>(
                notificationEndpoints.all
            )
            return data
        }
    })
}

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosPrivate.put(notificationEndpoints.read(id))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [notificationEndpoints.all] })
        },
        onError: () => {
            showError('Xabarni o\'qilgan deb belgilashda xatolik yuz berdi')
        }
    })
}

export const useRegisterDevice = () => {
    return useMutation({
        mutationFn: async (request: RegisterDeviceRequest): Promise<ApiResponse<RegisterDeviceResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<RegisterDeviceResponse>>(
                notificationEndpoints.registerDevice,
                request
            )
            return data
        },
        onSuccess: () => {
            showSuccess('Qurilma muvaffaqiyatli ro\'yxatdan o\'tdi')
        },
        onError: () => {
            showError('Qurilmani ro\'yxatdan o\'tkazishda xatolik yuz berdi')
        }
    })
}

