import { Bell } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useUserProfile } from "@/config/queries/users/profile.queries"
import { useNotifications } from "@/config/queries/notifications/notification.queries"

const Header = () => {
    const { data: profile, isLoading } = useUserProfile()
    const { data: notifications } = useNotifications()

    const unreadCount = notifications?.unread_count || 0
    const userName = profile?.data?.full_name || ''
    const userAvatar = profile?.data?.avatar || ''
    const initials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'

    return (
        <div className="flex items-center justify-between">
            <Link to="/profile">
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={userAvatar} alt="User" />
                    <AvatarFallback>{isLoading ? '...' : initials || 'U'}</AvatarFallback>
                </Avatar>
            </Link>
            <Link to="/">
                <div className="flex items-center justify-center gap-2">
                    <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
                    <span className="text-gray-900 font-medium">Online</span>
                </div>
            </Link>

            <button className="relative">
                <Bell className="h-6 w-6 text-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    )
}

export default Header