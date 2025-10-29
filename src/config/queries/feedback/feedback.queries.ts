import { axiosPrivate } from '@/config/api/api'
import { feedbackEndpoints } from '@/config/api/endpoint'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { showSuccess, showError } from '@/shared/utils/notifications'

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
}

export interface SubmitOrderFeedbackRequest {
    rating: number
    comment: string
}

export interface SubmitServiceFeedbackRequest {
    rating: number
    comment: string
    order_id: string
}

export interface Feedback {
    id: string
    service_id?: string
    user_id: string
    order_id: string
    rating: number
    comment: string
    created_at: string
    updated_at?: string
}

export interface ServiceFeedbackUser {
    full_name: string
    avatar_url: string
}

export interface ServiceFeedbackOrder {
    order_number: string
    completed_at: string
}

export interface ServiceFeedback extends Omit<Feedback, 'service_id'> {
    user?: ServiceFeedbackUser
    order: ServiceFeedbackOrder
}

export interface ServiceFeedbackSummary {
    average_rating: number
    total_reviews: number
    rating_distribution: {
        '5': number
        '4': number
        '3': number
        '2': number
        '1': number
    }
}

export interface ServiceFeedbackResponse extends PaginatedApiResponse<ServiceFeedback[]> {
    summary: ServiceFeedbackSummary
}

export interface ActualServiceFeedbackResponse {
    success: boolean
    data: {
        feedbacks: ServiceFeedback[]
    }
    error: null
    validation_error: null
    pagination: null
    meta: {
        timestamp: string
        request_id: string
        version: string
    }
}

export interface MyFeedbackService {
    title: string
    address: string
}

export interface MyFeedback extends Feedback {
    service?: MyFeedbackService
    order: ServiceFeedbackOrder
}

export interface UpdateFeedbackRequest {
    rating: number
    comment: string
}

export interface UpdateFeedbackResponse {
    id: string
    rating: number
    comment: string
    updated_at: string
}

export interface DeleteFeedbackResponse {
    message: string
}

export interface ServiceFeedbackParams {
    page?: number
    limit?: number
    rating?: number
    sort?: string
}

export interface MyFeedbackParams {
    page?: number
    limit?: number
}

export const useServiceFeedback = (serviceId: string, params?: ServiceFeedbackParams) => {
    return useQuery({
        queryKey: [feedbackEndpoints.serviceFeedback(serviceId), params],
        queryFn: async (): Promise<ServiceFeedbackResponse> => {
            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))
            if (params?.rating) queryParams.append('rating', String(params.rating))
            if (params?.sort) queryParams.append('sort', params.sort)

            const queryString = queryParams.toString()
            const url = queryString ? `${feedbackEndpoints.serviceFeedback(serviceId)}?${queryString}` : feedbackEndpoints.serviceFeedback(serviceId)

            const { data } = await axiosPrivate.get<ServiceFeedbackResponse>(url)
            return data
        },
        enabled: !!serviceId
    })
}

export const useMyFeedback = (params?: MyFeedbackParams) => {
    return useQuery({
        queryKey: [feedbackEndpoints.myFeedback, params],
        queryFn: async (): Promise<PaginatedApiResponse<MyFeedback[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))

            const queryString = queryParams.toString()
            const url = queryString ? `${feedbackEndpoints.myFeedback}?${queryString}` : feedbackEndpoints.myFeedback

            const { data } = await axiosPrivate.get<PaginatedApiResponse<MyFeedback[]>>(url)
            return data
        }
    })
}

export const useSubmitOrderFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ orderId, ...request }: { orderId: string } & SubmitOrderFeedbackRequest): Promise<ApiResponse<Feedback>> => {
            const { data } = await axiosPrivate.post<ApiResponse<Feedback>>(
                feedbackEndpoints.submitOrderFeedback(orderId),
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.myFeedback] })
            showSuccess('Fikr-mulohaza muvaffaqiyatli yuborildi')
        },
        onError: () => {
            showError('Fikr-mulohaza yuborishda xatolik yuz berdi')
        }
    })
}

export const useUpdateFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...request }: { id: string } & UpdateFeedbackRequest): Promise<ApiResponse<UpdateFeedbackResponse>> => {
            const { data } = await axiosPrivate.put<ApiResponse<UpdateFeedbackResponse>>(
                feedbackEndpoints.one(id),
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.myFeedback] })
            showSuccess('Fikr-mulohaza muvaffaqiyatli yangilandi')
        },
        onError: () => {
            showError('Fikr-mulohazani yangilashda xatolik yuz berdi')
        }
    })
}

export const useDeleteFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string): Promise<ApiResponse<DeleteFeedbackResponse>> => {
            const { data } = await axiosPrivate.delete<ApiResponse<DeleteFeedbackResponse>>(
                feedbackEndpoints.one(id)
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.myFeedback] })
            showSuccess('Fikr-mulohaza muvaffaqiyatli o\'chirildi')
        },
        onError: () => {
            showError('Fikr-mulohazani o\'chirishda xatolik yuz berdi')
        }
    })
}

export const useSubmitServiceFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ serviceId, ...request }: { serviceId: string } & SubmitServiceFeedbackRequest): Promise<ApiResponse<Feedback>> => {
            const { data } = await axiosPrivate.post<ApiResponse<Feedback>>(
                feedbackEndpoints.createServiceFeedback(serviceId),
                request
            )
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.serviceFeedback(variables.serviceId)] })
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.myFeedback] })
            showSuccess('Fikr-mulohaza muvaffaqiyatli yuborildi')
        },
        onError: () => {
            showError('Fikr-mulohaza yuborishda xatolik yuz berdi')
        }
    })
}

export const useDeleteServiceFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ serviceId, feedbackId }: { serviceId: string, feedbackId: string }): Promise<ApiResponse<DeleteFeedbackResponse>> => {
            const { data } = await axiosPrivate.delete<ApiResponse<DeleteFeedbackResponse>>(
                feedbackEndpoints.deleteServiceFeedback(serviceId, feedbackId)
            )
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.serviceFeedback(variables.serviceId)] })
            queryClient.invalidateQueries({ queryKey: [feedbackEndpoints.myFeedback] })
            showSuccess('Fikr-mulohaza muvaffaqiyatli o\'chirildi')
        },
        onError: () => {
            showError('Fikr-mulohazani o\'chirishda xatolik yuz berdi')
        }
    })
}

