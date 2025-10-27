import { axiosPrivate } from '@/config/api/api'
import { stationEndpoints } from '@/config/api/endpoint'
import { useQuery } from '@tanstack/react-query'

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

export interface PreviewPhoto {
    id: string
    url: string
}

export interface FuelType {
    id: string
    type: string
    name: string
    price: number
    available: boolean
    booking_fee: number
}

export interface FuelTypeWithUnits extends FuelType {
    units: {
        id: string
        name: string
        available: boolean
    }[]
}

export interface WorkTimeToday {
    from: string
    to: string
}

export interface WorkTime {
    day: number
    from: string
    to: string
    is_closed: boolean
}

export interface RevenueDistribution {
    period: {
        from: string
        to: string
    }
    revenue: {
        total_orders: number
        total_booking_fees: number
        service_share: number
        platform_commission: number
        average_commission_rate: number
        total_fuel_sales: number
        net_revenue: number
    }
    trends: any[]
    top_fuel_types: any[]
}

export interface StationListItem {
    id: string
    name: string
    address: string
    distance: number
    latitude: number
    longitude: number
    preview_photos: PreviewPhoto[]
    rating: number
    reviews_count: number
    is_open: boolean
    current_queue: number
    estimated_wait: number
    work_time_today: WorkTimeToday
    fuel_types: FuelType[]
}

export interface StationDetails extends Omit<StationListItem, 'fuel_types' | 'work_time_today'> {
    description: string
    phone: string
    is_verified: boolean
    work_times: WorkTime[]
    fuel_types: FuelTypeWithUnits[]
}

export interface TimeSlot {
    time: string
    available: boolean
    queue_length: number
    unit_id: string | null
}

export interface TimeSlotsResponse {
    date: string
    slots: TimeSlot[]
}

export interface ListStationsParams {
    lat?: number
    lng?: number
    radius?: number
    fuel_type?: string
    is_open?: boolean
}

export interface TimeSlotsParams {
    date: string
    fuel_type_id: string
}

export const useStations = (params?: ListStationsParams) => {
    return useQuery({
        queryKey: [stationEndpoints.all, params],
        queryFn: async (): Promise<PaginatedApiResponse<StationListItem[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.lat) queryParams.append('lat', String(params.lat))
            if (params?.lng) queryParams.append('lng', String(params.lng))
            if (params?.radius) queryParams.append('radius', String(params.radius))
            if (params?.fuel_type) queryParams.append('fuel_type', params.fuel_type)
            if (params?.is_open !== undefined) queryParams.append('is_open', String(params.is_open))

            const queryString = queryParams.toString()
            const url = queryString ? `${stationEndpoints.all}?${queryString}` : stationEndpoints.all

            const { data } = await axiosPrivate.get<PaginatedApiResponse<StationListItem[]>>(url)
            return data
        }
    })
}

export const useStationDetails = (id: string) => {
    return useQuery({
        queryKey: [stationEndpoints.one(id)],
        queryFn: async (): Promise<ApiResponse<StationDetails>> => {
            const { data } = await axiosPrivate.get<ApiResponse<StationDetails>>(
                stationEndpoints.one(id)
            )
            return data
        },
        enabled: !!id
    })
}

export const useStationTimeSlots = (id: string, params: TimeSlotsParams) => {
    return useQuery({
        queryKey: [stationEndpoints.timeSlots(id), params],
        queryFn: async (): Promise<ApiResponse<TimeSlotsResponse>> => {
            const queryParams = new URLSearchParams()
            queryParams.append('date', params.date)
            queryParams.append('fuel_type_id', params.fuel_type_id)

            const url = `${stationEndpoints.timeSlots(id)}?${queryParams.toString()}`

            const { data } = await axiosPrivate.get<ApiResponse<TimeSlotsResponse>>(url)
            return data
        },
        enabled: !!id && !!params.date && !!params.fuel_type_id
    })
}

