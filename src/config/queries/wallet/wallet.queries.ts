import { axiosPrivate } from '@/config/api/api'
import { walletEndpoints } from '@/config/api/endpoint'
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

export interface LastTransaction {
    id: string
    type: string
    amount: number
    created_at: string
}

export interface Wallet {
    id: string
    balance: number
    reserved_balance: number
    available_balance: number
    currency: string
    last_transaction: LastTransaction
}

export interface Transaction {
    id: string
    type: string
    title: string
    direction: 'debit' | 'credit'
    amount: number
    balance_after: number
    description: string
    order_id?: string
    status: string
    created_at: string
}

export interface TransactionsSummary {
    total_debit: number
    total_credit: number
    period: string
}

export interface TransactionsResponse extends PaginatedApiResponse<Transaction[]> {
    summary: TransactionsSummary
}

export interface TopUpRequest {
    amount: number
    payment_method: string
}

export interface TopUpResponse {
    invoice_id: string
    amount: number
    payment_url: string
    expires_at: string
}

export interface TransactionsParams {
    type?: string
    from_date?: string
    to_date?: string
    page?: number
    limit?: number
}

export const useWallet = () => {
    return useQuery({
        queryKey: [walletEndpoints.wallet],
        queryFn: async (): Promise<ApiResponse<Wallet>> => {
            const { data } = await axiosPrivate.get<ApiResponse<Wallet>>(
                walletEndpoints.wallet
            )
            return data
        }
    })
}

export const useTransactions = (params?: TransactionsParams) => {
    return useQuery({
        queryKey: [walletEndpoints.transactions, params],
        queryFn: async (): Promise<TransactionsResponse> => {
            const queryParams = new URLSearchParams()
            if (params?.type) queryParams.append('type', params.type)
            if (params?.from_date) queryParams.append('from_date', params.from_date)
            if (params?.to_date) queryParams.append('to_date', params.to_date)
            if (params?.page) queryParams.append('page', String(params.page))
            if (params?.limit) queryParams.append('limit', String(params.limit))

            const queryString = queryParams.toString()
            const url = queryString ? `${walletEndpoints.transactions}?${queryString}` : walletEndpoints.transactions

            const { data } = await axiosPrivate.get<TransactionsResponse>(url)
            return data
        }
    })
}

export const useTopUpWallet = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: TopUpRequest): Promise<ApiResponse<TopUpResponse>> => {
            const { data } = await axiosPrivate.post<ApiResponse<TopUpResponse>>(
                walletEndpoints.topup,
                request
            )
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [walletEndpoints.wallet] })
            showSuccess('Hamyon muvaffaqiyatli to\'ldirildi')
        },
        onError: () => {
            showError('Hamyonni to\'ldirishda xatolik yuz berdi')
        }
    })
}

