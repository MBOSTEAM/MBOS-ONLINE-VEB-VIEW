// import { Layout } from '@/components/layout/layout'
import { Suspense } from '@/shared/ui/suspense'
import { createBrowserRouter } from 'react-router-dom'
import { Home, Profile } from './lazy-pages'


export const router = createBrowserRouter([
	{
		path: '',
		// element: <Layout />,
		children: [
			{
				path: '/'
			},
			// {
			// 	element: <RequireAuth />,
			// 	children: [
			// 		{
			// 			path: '/settings',
			// 			element: (
			// 				<Suspense>
			// 					<Settings />
			// 				</Suspense>
			// 			)
			// 		}
			// 	]
			// },
			{
				index: true,
				element: (
					<Suspense>
						<Home />
					</Suspense>
				)
			},
			{
				path: '/profile',
				element: (
					<Suspense>
						<Profile />
					</Suspense>
				)
			},
		]
	}
])