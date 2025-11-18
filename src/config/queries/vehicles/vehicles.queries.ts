import { axiosPrivate } from '@/config/api/api'
import { userEndpoints } from '@/config/api/endpoint'
import { useMutation, useQueryClient, useQuery, useInfiniteQuery } from '@tanstack/react-query'
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

export interface Brand {
    id: number
    name: string
}

export interface Model {
    id: number
    name: string
    brand_id: number
}

export interface BrandWithModels extends Brand {
    models: Model[]
    country?: string
}

export interface VehicleParams {
    brands: BrandWithModels[]
    models?: Model[]
    colors: string[]
}

export interface UserVehicle {
    id: string
    plate_number: string
    color: string
    model: string
    brand: string
    year?: number
    total_orders?: number
    last_used?: string
    created_at?: string
}

export interface AddVehicleRequest {
    brand: string
    model: string
    color: string
    plate_number: string
    year: number
}

export interface AddVehicleResponse {
    id: string
    brand: string
    model: string
    color: string
    plate_number: string
    year: number
    created_at: string
}

export interface UpdateVehicleRequest {
    brand?: string
    model?: string
    color?: string
    plate_number?: string
}

export interface UpdateVehicleResponse {
    id: string
    plate_number: string
    brand: string
    model: string
    color: string
}

export interface DeleteVehicleResponse {
    message: string
}

export const useVehicleParams = () => {
    return useQuery({
        queryKey: [userEndpoints.vehicleParams],
        queryFn: async (): Promise<ApiResponse<VehicleParams>> => {
            const response = await axiosPrivate.get<ApiResponse<VehicleParams>>(
                userEndpoints.vehicleParams
            )
            // API returns nested structure: { success, data: { brands, models, colors } }
            return response.data
        }
    })
}

export interface ListVehiclesParams {
    page?: number
    limit?: number
    plate_number?: string
    color?: string
    model?: string
    brand?: string
}

export const useUserVehicles = (params?: ListVehiclesParams) => {
    return useQuery({
        queryKey: [userEndpoints.vehicles, params],
        queryFn: async (): Promise<PaginatedApiResponse<UserVehicle[]>> => {
            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))
            if (params?.plate_number) queryParams.append('plate_number', params.plate_number)
            if (params?.color) queryParams.append('color', params.color)
            if (params?.model) queryParams.append('model', params.model)
            if (params?.brand) queryParams.append('brand', params.brand)

            const queryString = queryParams.toString()
            const url = queryString ? `${userEndpoints.vehicles}?${queryString}` : userEndpoints.vehicles

            const response = await axiosPrivate.get<PaginatedApiResponse<UserVehicle[]>>(url)
            return response.data
        }
    })
}

export const useAddVehicle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: AddVehicleRequest): Promise<ApiResponse<AddVehicleResponse>> => {
            const response = await axiosPrivate.post<ApiResponse<AddVehicleResponse>>(
                userEndpoints.vehicles,
                request
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [userEndpoints.vehicles] })
            showSuccess('Transport vositasi muvaffaqiyatli qo\'shildi')
        },
        onError: (error: any) => {
            console.log(error)
            const errorMessage = error?.response?.data?.message || error?.message || 'Transport vositasi qo\'shishda xatolik yuz berdi'
            showError(errorMessage)
        }
    })
}

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...request }: { id: string } & UpdateVehicleRequest): Promise<ApiResponse<UpdateVehicleResponse>> => {
            const response = await axiosPrivate.patch<ApiResponse<UpdateVehicleResponse>>(
                userEndpoints.vehicle(id),
                request
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [userEndpoints.vehicles] })
            showSuccess('Transport vositasi muvaffaqiyatli yangilandi')
        },
        onError: () => {
            showError('Transport vositasi yangilashda xatolik yuz berdi')
        }
    })
}

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string): Promise<ApiResponse<DeleteVehicleResponse>> => {
            const response = await axiosPrivate.delete<ApiResponse<DeleteVehicleResponse>>(
                userEndpoints.vehicle(id)
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [userEndpoints.vehicles] })
            showSuccess('Transport vositasi muvaffaqiyatli o\'chirildi')
        },
        onError: () => {
            showError('Transport vositasi o\'chirishda xatolik yuz berdi')
        }
    })
}

// Infinite scroll hooks for brands and models
export const useBrandsInfinite = (limit: number = 20) => {
    return useInfiniteQuery({
        queryKey: ['brands-infinite'],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const queryParams = new URLSearchParams()
                queryParams.append('page', String(pageParam))
                queryParams.append('limit', String(limit))

                const url = `${userEndpoints.vehicleParams}?${queryParams.toString()}`
                
                const response = await axiosPrivate.get(url)
                
                // API response might not match expected structure
                // Try to extract data properly
                const data = response.data
                
                // If response.data is an object with brands array
                if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
                    // Extract brands if available
                    if (data.data.brands && Array.isArray(data.data.brands)) {
                        return {
                            success: true,
                            data: data.data.brands,
                            pagination: data.pagination || { page: pageParam, limit, total: data.data.brands.length, total_pages: 1 }
                        }
                    }
                }
                
                // If data is already in the expected format
                return data
            } catch (error) {
                console.error('Error fetching brands:', error)
                throw error
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.pagination) return undefined
            if (lastPage.pagination.page < lastPage.pagination.total_pages) {
                return lastPage.pagination.page + 1
            }
            return undefined
        }
    })
}

export const useModelsByBrandInfinite = (brandId: string, limit: number = 20) => {
    return useInfiniteQuery({
        queryKey: ['models-by-brand-infinite', brandId],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const queryParams = new URLSearchParams()
                queryParams.append('page', String(pageParam))
                queryParams.append('limit', String(limit))

                const url = `${userEndpoints.vehicleParamById(brandId)}?${queryParams.toString()}`
                
                const response = await axiosPrivate.get<PaginatedApiResponse<Array<string | { id: string; name: string }>>>(url)
                
                return response.data
            } catch (error) {
                console.error('Error fetching models:', error)
                throw error
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.pagination) return undefined
            if (lastPage.pagination.page < lastPage.pagination.total_pages) {
                return lastPage.pagination.page + 1
            }
            return undefined
        },
        enabled: !!brandId
    })
}

