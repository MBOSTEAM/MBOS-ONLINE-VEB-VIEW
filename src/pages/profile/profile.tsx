import {
  User,
  Settings,
  Car,
  Users,
  Languages,
  Mail,
  DoorOpen,
} from "lucide-react"
import { useUserProfile } from "@/config/queries/users/profile.queries"
import { useWallet } from "@/config/queries/wallet/wallet.queries"
import { useLogout } from "@/config/queries/auth/auth.queries"
import { Link, useNavigate } from "react-router-dom"
const baseURL = import.meta.env.VITE_API_URL_UPLOAD

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()

  if (profileLoading || walletLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      </div>
    )
  }

  const userData = profile?.data
  const walletData = wallet?.data
  const refreshToken = localStorage.getItem('refreshToken') || ''

  const handleLogout = () => {
    logout(refreshToken)
    navigate('/login')
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4 bg-background">
      {/* Header */}
      <div className="flex justify-center items-center">
        <div className="mb-12 flex items-center justify-center gap-2">
          <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
          <span className="text-gray-900 font-medium">Online</span>
          <div className="flex items-center justify-end relative left-30">
            <button onClick={handleLogout} className="cursor-pointer">
              <DoorOpen className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile section */}
      <div className="flex flex-col items-center text-center space-y-2">
        <img
          src={userData?.avatar ? `${baseURL}/${userData?.avatar}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <h2 className="text-xl font-semibold text-foreground">
          Hello, {userData?.full_name || 'User'}
        </h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-md">
          {userData?.phone_number}
        </span>
      </div>

      {/* Balance Card */}
      <div className="bg-blue-500 rounded-xl p-4 text-white flex justify-between items-center">
        <div>
          <p className="text-base opacity-80">Balance</p>
          <h3 className="text-2xl font-bold">
            {walletData ? `${walletData.balance.toLocaleString('ru-RU')} ${walletData.currency}` : '0 UZS'}
          </h3>
        </div>
        <button className="bg-blue-400 text-white text-sm px-4 py-1 rounded-md font-medium">
          Wallet
        </button>
      </div>

      {/* Menu Sections */}
      <div className="space-y-3">
        {/* First Group */}
        <div className="bg-muted rounded-xl divide-y divide-border">
          {[
            { icon: <User className="w-5 h-5" />, text: "Profile", to: '/profile' },
            { icon: <Settings className="w-5 h-5" />, text: "Orders", to: '/orders' },
            { icon: <Car className="w-5 h-5" />, text: "Vehicles", to: '/vehicles' },
            { icon: <Users className="w-5 h-5" />, text: "Referrals", to: '/referrals' },
          ].map((item) => (
            <Link
              key={item.text}
              to={item.to ?? '#'}
              className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-xl transition"
            >
              {item.icon}
              <span className="text-base font-medium">{item.text}</span>
            </Link>
          ))}
        </div>

        {/* Second Group */}
        <div className="bg-muted rounded-xl divide-y divide-border">
          {[
            { icon: <Languages className="w-5 h-5" />, text: "Language" },
            { icon: <Mail className="w-5 h-5" />, text: "Contact Us" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-xl transition"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
