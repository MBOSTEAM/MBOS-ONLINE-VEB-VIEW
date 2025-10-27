import { axiosPrivate } from '../../api/api'
import { userEndpoints } from '../../api/endpoint'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { showSuccess, showError } from '../../../shared/utils/notifications'

export interface ApiResponse<T> {
    success: boolean
    data: T
}


export interface VehicleParams {
    brands: string[]
    models: string[]
    colors: string[]
}

export interface UserVehicle {
    id: string
    user_id: string
    brand: string
    model: string
    color: string
    plate_number: string
    year: number
    status: string
    total_orders: number
    last_used: string
    created_at: string
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
    status: string
    created_at: string
}

export interface UpdateVehicleRequest {
    color?: string
    brand?: string
    model?: string
    year?: number
    plate_number?: string
}

export interface UpdateVehicleResponse {
    id: string
    brand: string
    model: string
    color: string
    plate_number: string
    year: number
    updated_at: string
}

export interface DeleteVehicleResponse {
    message: string
}

export const useVehicleParams = () => {
    return useQuery({
        queryKey: ['user', 'vehicle-params'],
        queryFn: async (): Promise<VehicleParams> => {
            const { data } = await axiosPrivate.get<VehicleParams>(
                userEndpoints.vehicleParams
            )
            return data
        }
    })
}

export const useUserVehicles = () => {
    return useQuery({
        queryKey: ['user', 'vehicles'],
        queryFn: async (): Promise<ApiResponse<UserVehicle[]>> => {
            const { data } = await axiosPrivate.get<ApiResponse<UserVehicle[]>>(
                userEndpoints.vehicles
            )
            return data
        }
    })
}

export const useAddVehicle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: AddVehicleRequest): Promise<ApiResponse<AddVehicleResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<AddVehicleResponse>>(
                userEndpoints.vehicles,
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'vehicles'] })
            showSuccess('Transport vositasi muvaffaqiyatli qo\'shildi')
        },
        onError: () => {
            showError('Transport vositasi qo\'shishda xatolik yuz berdi')
        }
    })
}

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...request }: { id: string } & UpdateVehicleRequest): Promise<ApiResponse<UpdateVehicleResponse>> => {
            const { data } = await axiosPrivate.put<ApiResponse<UpdateVehicleResponse>>(
                userEndpoints.vehicle(id),
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'vehicles'] })
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
            const { data } = await axiosPrivate.delete<ApiResponse<DeleteVehicleResponse>>(
                userEndpoints.vehicle(id)
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'vehicles'] })
            showSuccess('Transport vositasi muvaffaqiyatli o\'chirildi')
        },
        onError: () => {
            showError('Transport vositasi o\'chirishda xatolik yuz berdi')
        }
    })
}

