import Header from "@/shared/layout/header"
import BookingCard from "./ui/booking/booking-card"
import SearchBar from "@/shared/ui/search"
import Banner from "./ui/banner.tsx/banner"
import ServiceCategories from "./ui/categories/categories"
import Recommended from "./ui/recommended/recommended"

const Home = () => {

	return (
		<main className='flex flex-col'>
			<Header />
			<BookingCard/>
			<SearchBar/>
			<Banner/>
			<ServiceCategories/>
			<Recommended />
		</main>
	)
}

export default Home