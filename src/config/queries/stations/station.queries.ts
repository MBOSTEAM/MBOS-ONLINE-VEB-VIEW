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
    type: {
        id: string
        code: string
        name: string
        volume_unit: string
        description: string
    }
    price: number
    available: boolean
    booking_fee: number
}

export interface FuelTypeWithUnits extends FuelType {
    // Units are now separate at station level, not per fuel type
}

export interface WorkTimeToday {
    from: string
    to: string
}

export interface WorkTime {
    id: string
    day_of_week: number
    from_time: string
    to_time: string
    is_weekend: boolean
    status: string
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
    title: string | null
    address: string | null
    distance: number | null
    latitude: number | null
    longitude: number | null
    preview_photos?: PreviewPhoto[]
    preview_image?: string | null
    rating: number | null
    reviews_count: number | null
    is_open: boolean | null
    current_queue: number | null
    estimated_wait: number | null
    work_time_today: WorkTimeToday
    fuel_types: FuelType[]
}

export interface StationDetails extends Omit<StationListItem, 'fuel_types' | 'work_time_today' | 'preview_photos' | 'preview_image'> {
    title: string | null
    description: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    phone: string | null
    website: string | null
    service_id: string | null
    instagram: string | null
    telegram: string | null
    preview_photos?: PreviewPhoto[]
    rating: number | null
    reviews_count: number | null
    is_verified: boolean | null
    is_open: boolean | null
    current_queue: number | null
    work_times: WorkTime[]
    work_time_today?: {
        id: string
        from: string
        to: string
        day_of_week: number
        is_weekend: boolean
    }
    fuel_types: FuelTypeWithUnits[]
    units: {
        id: string
        name: string
        available: boolean
        description?: string | null
    }[]
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
    page?: number
    limit?: number
    fuel_type?: string
    is_open?: string
    category_id?: string
    type_id?: string
    region_id?: string
    district_id?: string
    rating?: string
}

export interface TimeSlotsParams {
    date: string
    fuel_type_id: string
    page?: number
    limit?: number
}

export const useStations = (params?: ListStationsParams) => {
    return useQuery({
        queryKey: [stationEndpoints.all, params],
        queryFn: async () => {
            try {
                const queryParams = new URLSearchParams()
                if (params?.page) queryParams.append('page', String(params.page))
                if (params?.limit) queryParams.append('limit', String(params.limit))
                if (params?.fuel_type) queryParams.append('fuel_type', params.fuel_type)
                if (params?.category_id) queryParams.append('category_id', params.category_id)
                if (params?.type_id) queryParams.append('type_id', params.type_id)
                if (params?.region_id) queryParams.append('region_id', params.region_id)
                if (params?.district_id) queryParams.append('district_id', params.district_id)
                if (params?.rating) queryParams.append('rating', params.rating)

                const queryString = queryParams.toString()
                const url = queryString ? `${stationEndpoints.all}?${queryString}` : stationEndpoints.all

                const response = await axiosPrivate.get(url)
                
                // API returns: { success, data: StationListItem[], pagination, error, meta, validation_error }
                if (response.data?.success && Array.isArray(response.data.data)) {
                    return {
                        success: response.data.success,
                        data: response.data.data,
                        pagination: response.data.pagination || {
                            page: params?.page || 1,
                            limit: params?.limit || 10,
                            total: response.data.data.length,
                            total_pages: 1
                        }
                    }
                }
                
                // Return empty data if API call succeeded but no data
                return {
                    success: false,
                    data: [],
                    pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
                }
            } catch (error: any) {
                // If API returns error (like validation error), return empty array
                console.error('Error fetching stations:', error?.response?.data || error)
                return {
                    success: false,
                    data: [],
                    pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
                }
            }
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
            if (params.page) queryParams.append('page', String(params.page))
            if (params.limit) queryParams.append('limit', String(params.limit))

            const url = `${stationEndpoints.timeSlots(id)}?${queryParams.toString()}`

            const { data } = await axiosPrivate.get<ApiResponse<TimeSlotsResponse>>(url)
            return data
        },
        enabled: !!id && !!params.date && !!params.fuel_type_id
    })
}

export const useStationsHighRating = (params?: { page?: number; limit?: number; rating?: string; region_id?: string }) => {
    return useQuery({
        queryKey: ['/api/v1/stations/high-rating', params],
        queryFn: async (): Promise<PaginatedApiResponse<StationListItem[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))
            if (params?.rating) queryParams.append('rating', params.rating)
            if (params?.region_id) queryParams.append('region_id', params.region_id)

            const queryString = queryParams.toString()
            const url = queryString ? `/api/v1/stations/high-rating?${queryString}` : '/api/v1/stations/high-rating'

            const { data } = await axiosPrivate.get<PaginatedApiResponse<StationListItem[]>>(url)
            return data
        }
    })
}

export const useStationsClosest = (params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['/api/v1/stations/closest', params],
        queryFn: async (): Promise<PaginatedApiResponse<StationListItem[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))

            const queryString = queryParams.toString()
            const url = queryString ? `/api/v1/stations/closest?${queryString}` : '/api/v1/stations/closest'

            const { data } = await axiosPrivate.get<PaginatedApiResponse<StationListItem[]>>(url)
            return data
        }
    })
}

