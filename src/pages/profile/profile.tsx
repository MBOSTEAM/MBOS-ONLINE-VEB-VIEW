import {
  User,
  Settings,
  Car,
  Users,
  Languages,
  Mail,
  DoorOpen,
  Trash2,
} from "lucide-react"
import { useUserProfile } from "@/config/queries/users/profile.queries"
import { useWallet } from "@/config/queries/wallet/wallet.queries"
import { useLogout } from "@/config/queries/auth/auth.queries"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
const baseURL = import.meta.env.VITE_API_URL_UPLOAD

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { mutate: logout } = useLogout()
  
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
    setShowLogoutModal(false)
  }

  const handleDeleteAccount = () => {
    console.log('Delete account functionality to be implemented')
    setShowDeleteModal(false)
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4 bg-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <Link to="/" className="p-2 rounded-full bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
          <span className="text-gray-900 font-medium">Online</span>
        </div>
        <button onClick={() => setShowLogoutModal(true)} className="p-2 rounded-full bg-muted cursor-pointer">
          <DoorOpen className="w-5 h-5 text-muted-foreground" />
        </button>
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
        <Link to="/wallet" className="bg-blue-400 text-white text-sm px-4 py-1 rounded-md font-medium">
          Wallet
        </Link>
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
            { 
              icon: <Trash2 className="w-5 h-5 text-red-500" />, 
              text: "Delete Account", 
              onClick: () => setShowDeleteModal(true),
              className: "text-red-500 hover:text-red-600"
            },
          ].map((item) => (
            <div
              key={item.text}
              onClick={item.onClick}
              className={`flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-xl transition cursor-pointer ${item.className || ''}`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-orange-100">
                <DoorOpen className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold">Tizimdan chiqish</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Haqiqatdan ham tizimdan chiqmoqchimisiz? Barcha ma'lumotlaringiz saqlanib qoladi.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLogoutModal(false)}
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1"
                onClick={handleLogout}
              >
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Hisobni o'chirish</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              <strong className="text-red-600">DIQQAT!</strong> Bu amalni bekor qilib bo'lmaydi. 
              Barcha ma'lumotlaringiz, buyurtmalaringiz va balansingiz butunlay o'chiriladi.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Bekor qilish
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteAccount}
              >
                O'chirish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
