import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from './providers/query-provider'
import { RouterProviders } from './providers/route-providers'


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryProvider>
			<RouterProviders />
		</QueryProvider>
	</StrictMode>
)