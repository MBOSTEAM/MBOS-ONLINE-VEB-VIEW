import { Outlet, useLocation } from 'react-router-dom'

export const Layout = () => {
	const { pathname } = useLocation()
	const hideNavbarRoutes = ['/login', '/verify-phone', '/setup-profile']

	return (
		<div className='flex justify-between w-full h-full'>
			<div className='bg-black flex-auto ' />
			<div className='container'>
				<div className='flex flex-col px-3 py-4 h-dvh gap-y-3'>
					<div className='flex-1 overflow-y-auto'>
						<Outlet />
					</div>
					{!hideNavbarRoutes.includes(pathname) }
				</div>
			</div>
			<div className='bg-black flex-auto ' />
		</div>
	)
}