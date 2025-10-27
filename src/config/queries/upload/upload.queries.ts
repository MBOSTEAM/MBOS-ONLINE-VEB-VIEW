import { axiosPrivate } from '../../api/api'
import { uploadEndpoints } from '../../api/endpoint'
import { useMutation } from '@tanstack/react-query'
import { showSuccess, showError } from '../../../shared/utils/notifications'

export interface ApiResponse<T> {
    success: boolean
    data: T
}

export interface UploadImageResponse {
    file_id: string
    url: string
    thumbnail_url: string
    size: number
    mime_type: string
}

export type UploadType = 'avatar' | 'station' | 'vehicle'

export interface UploadImageParams {
    file: File
    type: UploadType
}

export const useUploadImage = () => {
    return useMutation({
        mutationFn: async ({ file, type }: UploadImageParams): Promise<ApiResponse<UploadImageResponse>> => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)

            const { data } = await axiosPrivate.post<ApiResponse<UploadImageResponse>>(
                uploadEndpoints.image,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            return data
        },
        onSuccess: () => {
            showSuccess('Rasm muvaffaqiyatli yuklandi')
        },
        onError: () => {
            showError('Rasmni yuklashda xatolik yuz berdi')
        }
    })
}

