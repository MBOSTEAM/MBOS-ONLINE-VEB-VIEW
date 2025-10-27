import { Suspense } from '@/shared/ui/suspense'
import { createBrowserRouter } from 'react-router-dom'
import { Auth, Home, Profile, VerifyPhone, SetupProfile, Orders,  } from './lazy-pages'
import { Vehicles } from './lazy-pages'
import { AddVehicle } from './lazy-pages'
import { Layout } from '@/shared/layout/layout'
import { RequireAuth, RequireGuest } from '@/shared/auth/require-auth'

export const router = createBrowserRouter([
	{
		path: '',
		element: <Layout />,
		children: [
			// Auth routes (guest only)
			{
				element: <RequireGuest />,
				children: [
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
			},
			
			// Protected routes
			{
				element: <RequireAuth />,
				children: [
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
						path: '/vehicles',
						element: (
							<Suspense>
								<Vehicles />
							</Suspense>
						)
					},
					{
						path: '/vehicles/add',
						element: (
							<Suspense>
								<AddVehicle />
							</Suspense>
						)
					},
				]
			}
		]
	}
])