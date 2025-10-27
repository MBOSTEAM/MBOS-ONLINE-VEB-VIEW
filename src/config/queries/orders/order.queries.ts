import { axiosPrivate } from '../../api/api'
import { orderEndpoints } from '../../api/endpoint'
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
}

export interface CreateOrderRequest {
    station_id: string
    fuel_type_id: string
    unit_id: string
    vehicle_id: string
    scheduled_datetime: string
    refueling_type: 'volume' | 'amount'
    refueling_volume?: number
    refueling_amount?: number
    payment_method: string
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
    status: string
    station: {
        id: string
        name: string
        address: string
        preview_image?: string[]
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

export interface CreateOrderResponse extends Omit<OrderDetails, 'station' | 'payment'> {
    order_number: string
    station: StationPreview
    fuel_type: FuelTypeInfo
    refueling: RefuelingInfo & { estimated_cost: number }
    fees: FeesInfo
    payment: PaymentInfo
    qr_code: string
    created_at: string
}

export interface CancelOrderRequest {
    reason: string
}

export interface CancelOrderResponse {
    message: string
    refund: {
        amount: number
        status: string
        estimated_time: string
    }
}

export interface MarkArrivalResponse {
    message: string
    unit: UnitInfo
}

export interface ListOrdersParams {
    status?: 'active' | 'completed' | 'cancelled'
    page?: number
    limit?: number
    sort?: string
}

export const useOrders = (params?: ListOrdersParams) => {
    return useQuery({
        queryKey: [orderEndpoints.all, params],
        queryFn: async (): Promise<PaginatedApiResponse<OrderListItem[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.status) queryParams.append('status', params.status)
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))
            if (params?.sort) queryParams.append('sort', params.sort)

            const queryString = queryParams.toString()
            const url = queryString ? `${orderEndpoints.all}?${queryString}` : orderEndpoints.all

            const { data } = await axiosPrivate.get<PaginatedApiResponse<OrderListItem[]>>(url)
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
        onError: () => {
            showError('Buyurtma yaratishda xatolik yuz berdi')
        }
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...request }: { id: string } & CancelOrderRequest): Promise<ApiResponse<CancelOrderResponse>> => {
            const { data } = await axiosPrivate.patch<ApiResponse<CancelOrderResponse>>(
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
        mutationFn: async (id: string): Promise<ApiResponse<MarkArrivalResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<MarkArrivalResponse>>(
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

