import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@ta	nstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import type { PropsWithChildren } from 'react'

const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage
})

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1
		},
		mutations: {
			retry: 1
		}
	}
})

persistQueryClient({
	queryClient,
	persister: localStoragePersister
	// maxAge: 1000 * 60 * 60 * 24
})

export const QueryProvider = ({ children }: PropsWithChildren) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}