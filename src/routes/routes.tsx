// import { Layout } from '@/components/layout/layout'
import { Suspense } from '@/shared/ui/suspense'
import { createBrowserRouter } from 'react-router-dom'
import { Auth, Home, Profile, VerifyPhone, SetupProfile, Orders } from './lazy-pages'
import { Layout } from '@/shared/layout/layout'


export const router = createBrowserRouter([
	{
		path: '',
		element: <Layout />,
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
			{
				path: '/orders',
				element: (
					<Suspense>
						<Orders />
					</Suspense>
				)
			},
			{
				path: '/login',
				element: (
					<Suspense>
						<Auth />
					</Suspense>
				)
			},
			{
				path: '/verify-phone',
				element: (
					<Suspense>
						<VerifyPhone />
					</Suspense>
				)
			},
			{
				path: '/setup-profile',
				element: (
					<Suspense>
						<SetupProfile />
					</Suspense>
				)
			},
		]
	}
])