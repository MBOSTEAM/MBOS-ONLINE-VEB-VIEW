import { Bell } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
const Header = () => {
    return (
        <div className="flex items-center justify-between">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="/user-avatar.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className=" flex items-center justify-center gap-2">
                    <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
                    <span className="text-gray-900 font-medium">Online</span>
                </div>
          
            <button className="relative">
                <Bell className="h-6 w-6 text-foreground" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
        </div>

    )
}

export default Header