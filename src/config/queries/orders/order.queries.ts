import { axiosPrivate } from '@/config/api/api'
import { orderEndpoints } from '@/config/api/endpoint'
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

export interface CreateOrderRequest {
    station_id: string
    fuel_type_id: string
    unit_id: string
    vehicle_id: string
    scheduled_datetime: string
    refueling_type: 'volume' | 'fill_in_amount'
    refueling_volume: number | null
    refueling_amount: number | null
    payment_method: 'wallet' | 'company_wallet'
    special_instructions?: string
}

export interface StationPreview {
    id: string
    name: string
    address: string
}

export interface StationDetails extends StationPreview {
    phone: string
    latitude: number
    longitude: number
}

export interface FuelTypeInfo {
    id: string
    type: string
    name?: string
    price: number
}

export interface RefuelingInfo {
    type: string
    volume?: number
    amount?: number
    estimated_cost?: number
    requested_volume?: number
    actual_volume?: number | null
    requested_amount?: number
    actual_amount?: number | null
}

export interface FeesInfo {
    booking_fee: number
    service_fee: number
    total: number
}

export interface PaymentInfo {
    method: string
    status: string
    invoice_id?: string
    total_paid?: number
    transactions?: Transaction[]
}

export interface Transaction {
    id: string
    type: string
    amount: number
    status: string
    created_at: string
}

export interface UnitInfo {
    id: string
    name: string
}

export interface TimelineEvent {
    status: string
    timestamp: string
}

export interface OrderListItem {
    id: string
    order_number: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed' | 'customer_arrived' | 'in_progress' | 'no_show'
    station: {
        id: string
        name: string
        address: string | null
        preview_image?: string
    }
    scheduled_datetime: string
    fuel_type: string
    total_amount: number
    created_at: string
}

export interface OrderDetails {
    id: string
    order_number: string
    status: string
    station: StationDetails
    scheduled_datetime: string
    arrived_at: string | null
    started_at: string | null
    completed_at: string | null
    fuel_type: FuelTypeInfo
    unit: UnitInfo
    refueling: RefuelingInfo
    payment: PaymentInfo & FeesInfo
    attendant: any | null
    qr_code: string
    timeline: TimelineEvent[]
}

export interface CreateOrderResponse {
    id: string
    order_number: string
    status: string
    station: {
        id: string
        name: string
        address: string
    }
    scheduled_datetime: string
    fuel_type: {
        id: string
        type: string
        price: number
    }
    refueling: {
        type: string
        volume: number | null
        amount: number | null
        estimated_cost: number
    }
    fees: {
        booking_fee: number
        service_fee: number
        total: number
    }
    payment: {
        method: string
        status: string
        invoice_id: string
    }
    qr_code: string
    created_at: string
}

export interface CancelOrderRequest {
    reason: string
}

export interface CancelOrderResponse {
    success: boolean
    data: {
        message: string
        refund: {
            amount: number
            status: string
            estimated_time: string
        }
    }
}

export interface MarkArrivalResponse {
    success: boolean
    data: {
        message: string
        unit: {
            id: string
            name: string
        }
    }
}

export interface ListOrdersParams {
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed' | 'customer_arrived' | 'in_progress' | 'no_show'
    page?: number
    limit?: number
    station_id?: string
    sort_field?: 'created_at' | 'scheduled_at' | 'total_price'
    sort_order?: 'asc' | 'desc'
}

export const useOrders = (params?: ListOrdersParams) => {
    return useQuery({
        queryKey: [orderEndpoints.all, params],
        queryFn: async (): Promise<PaginatedApiResponse<OrderListItem[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.status) queryParams.append('status', params.status)
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))
            if (params?.sort_field) queryParams.append('sort_field', params.sort_field)
            if (params?.sort_order) queryParams.append('sort_order', params.sort_order)

            const queryString = queryParams.toString()
            const url = queryString ? `${orderEndpoints.all}?${queryString}` : orderEndpoints.all

            const { data } = await axiosPrivate.get<PaginatedApiResponse<OrderListItem[]>>(url)
            // API returns nested data structure: { success, data: { data: [...] } }
            return data
        }
    })
}

export const useOrderDetails = (id: string) => {
    return useQuery({
        queryKey: [orderEndpoints.one(id)],
        queryFn: async (): Promise<ApiResponse<OrderDetails>> => {
            const { data } = await axiosPrivate.get<ApiResponse<OrderDetails>>(
                orderEndpoints.one(id)
            )
            return data
        },
        enabled: !!id
    })
}

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<CreateOrderResponse>>(
                orderEndpoints.all,
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [orderEndpoints.all] })
            showSuccess('Buyurtma muvaffaqiyatli yaratildi')
        },
        onError: (error: any) => {
            console.log(error)
            showError(error.response.data.error.code === 'INVALID_FUEL_PRICE' ? 'Hamyonda yetarli mablag\' mavjud emas' : 'Buyurtma yaratishda xatolik yuz berdi')
        }
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...request }: { id: string } & CancelOrderRequest): Promise<CancelOrderResponse> => {
            const { data } = await axiosPrivate.patch<CancelOrderResponse>(
                orderEndpoints.cancel(id),
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [orderEndpoints.all] })
            showSuccess('Buyurtma muvaffaqiyatli bekor qilindi')
        },
        onError: () => {
            showError('Buyurtmani bekor qilishda xatolik yuz berdi')
        }
    })
}

export const useMarkArrival = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string): Promise<MarkArrivalResponse> => {
            const { data } = await axiosPrivate.post<MarkArrivalResponse>(
                orderEndpoints.arrived(id)
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [orderEndpoints.all] })
            showSuccess('Yetib kelganingiz tasdiqlandi')
        },
        onError: () => {
            showError('Yetib kelishni tasdiqlashda xatolik yuz berdi')
        }
    })
}

