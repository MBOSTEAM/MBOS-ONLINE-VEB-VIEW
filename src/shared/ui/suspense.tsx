import {  Suspense as ReactSuspense, type PropsWithChildren } from 'react'
import { Loader } from 'lucide-react'

export const LoadingScreen = () => {
	return (
		<div className='fixed inset-0 grid items-center w-full h-full justify-items-center'>
			<Loader className='animate-spin' />
		</div>
	)
}

export const Suspense = ({ children }: PropsWithChildren) => {
	return <ReactSuspense fallback={<LoadingScreen />}>{children}</ReactSuspense>
}