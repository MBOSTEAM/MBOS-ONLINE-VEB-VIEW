import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, type TNavLink } from './navlinks'


const Navbar = () => {
	const { pathname } = useLocation()
	// const { onOpen } = useScannerModalStore()

	function isActivePage(link: string) {
		return pathname === link
	}

	const Content = ({ icon, link, title }: TNavLink) => (
		<>
			<div
				className={clsx(
					'flex items-center justify-center',
					isActivePage(link)
						? 'stroke-white fill-white bg-primary-light'
						: 'stroke-black-button fill-none',
					title === 'scan' ? 'w-12 h-12 stroke-white' : 'w-9 h-6 rounded-xl'
				)}>
				{icon}
			</div>
			{title !== 'scan' && (
				<span
					className={clsx(
						'font-normal text-xs leading-4 tracking-[0%] capitalize',
						isActivePage(link) ? 'text-primary-light' : 'text-black-button',
						title === 'scan' ? 'text-md ' : 'text-xs'
					)}>
                           titdw
				</span>
                
                
			)}
		</>
	)

	return (
		<nav className='flex items-center justify-between gap-x-3 p-3 shrink-0 bg-black-button-light-hover rounded-xl'>
			{navLinks.map(({ title, link, icon }) =>
				title === 'scan' ? (
					<button
						key={title}
						// onClick={onOpen}
						className='cursor-pointer flex flex-col items-center gap-y-1 bg-primary-light rounded-full'>
						<Content
							icon={icon}
							link={link}
							title={title}
						/>
					</button>
				) : (
					<Link
						key={title}
						to={link}
						className='flex flex-col items-center gap-y-1'>
						<Content
							icon={icon}
							link={link}
							title={title}
						/>
					</Link>
				)
			)}
		</nav>
	)
}

export default Navbar