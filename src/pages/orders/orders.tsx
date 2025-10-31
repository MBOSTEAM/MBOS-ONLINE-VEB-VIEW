import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Menu, ArrowLeft, Clock, MapPin, Fuel } from "lucide-react"
import Tabs, { TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useOrders } from "@/config/queries/orders/order.queries"
import { formatTz } from "@/shared/utils/time"


export default function OrdersPage() {
  const [tab, setTab] = useState<string>("today")

  const { data: ordersData, isLoading, error } = useOrders()

  function getStatusInfo(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return { variant: "default", label: "KUTILMOQDA", className: "bg-yellow-500 hover:bg-yellow-600 text-white" }
      case "confirmed":
        return { variant: "secondary", label: "TASDIQLANDI", className: "bg-green-500 hover:bg-green-600 text-white" }
      case "customer_arrived":
        return { variant: "outline", label: "KELDI", className: "bg-blue-500 hover:bg-blue-600 text-white" }
      case "in_progress":
        return { variant: "outline", label: "DAVOM ETVOTGAN", className: "bg-purple-500 hover:bg-purple-600 text-white" }
      case "completed":
        return { variant: "secondary", label: "TUGALLANDI", className: "bg-emerald-500 hover:bg-emerald-600 text-white" }
      case "cancelled":
        return { variant: "destructive", label: "BEKOR QILINDI", className: "bg-red-500 hover:bg-red-600 text-white" }
      case "failed":
        return { variant: "destructive", label: "YARATILMADI", className: "bg-red-500 hover:bg-red-600 text-white" }
      case "no_show":
        return { variant: "destructive", label: "KELMADI", className: "bg-orange-500 hover:bg-orange-600 text-white" }
      default:
        return { variant: "default", label: status.toUpperCase(), className: "bg-gray-500 text-white" }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'yesterday'
    } else {
      return 'other'
    }
  }

  const formatTime = (dateString: string) => formatTz(dateString, 'HH:mm')

  const filteredOrders = useMemo(() => {
    if (!ordersData?.data) return []

    const orders = ordersData.data

    switch (tab) {
      case "confirmed":
        return orders.filter((order) => order.status === "confirmed")
      case "declined":
        return orders.filter((order) =>
          order.status === "cancelled" ||
          order.status === "failed" ||
          order.status === "no_show"
        )
      case "yesterday":
        return orders.filter((order) => formatDate(order.scheduled_datetime) === 'yesterday')
      case "today":
      default:
        return orders.filter((order) => formatDate(order.scheduled_datetime) === 'today')
    }
  }, [tab, ordersData])

  if (isLoading) {
    return (
      <div className="px-4 pt-6 max-w-xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="h-8 bg-muted rounded mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 pt-6 max-w-xl mx-auto text-center">
        <div className="text-red-500 mb-4">
          <h3 className="text-lg font-semibold">Xatolik yuz berdi</h3>
          <p className="text-sm">Buyurtmalarni yuklashda muammo</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Qayta urinish
        </Button>
      </div>
    )
  }

  if (!ordersData?.data || ordersData.data.length === 0) {
    return (
      <div className="px-4 pt-6 max-w-xl mx-auto text-center">
        <div className="text-muted-foreground mb-4">
          <h3 className="text-lg font-semibold">Buyurtmalar yo'q</h3>
          <p className="text-sm">Hozircha hech qanday buyurtma yo'q</p>
        </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Bosh sahifaga qaytish
          </Button>
        </Link>
      </div>
    )
  }
  return (
    <div className="px-4 pt-6 max-w-xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <Link to="/profile" className="p-2 rounded-full bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-xl font-semibold">Buyurtmalar</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon-lg" aria-label="filter"><Menu size={30} /></Button>
        </div>
      </header>

      <nav className="mb-4">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex gap-2 overflow-x-auto">
            <TabsTrigger value="today">Bugun</TabsTrigger>
            <TabsTrigger value="yesterday">Kecha</TabsTrigger>
            <TabsTrigger value="confirmed">Tasdiqlangan</TabsTrigger>
            <TabsTrigger value="declined">Bekor qilingan</TabsTrigger>
          </div>
        </Tabs>
      </nav>

      <section className="flex flex-col gap-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          const scheduledDate = new Date(order.scheduled_datetime)

          return (
            <Card key={order.id} className="flex flex-row items-stretch hover:shadow-md transition-shadow">
              <div className="flex-1">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={statusInfo.className}>
                      {statusInfo.label}
                    </Badge>
                    <div className="text-xs text-muted-foreground font-mono">
                      {order.order_number}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-primary" />
                      {order.station.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3" />
                      {order.station.address}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Rejalashtirilgan:</span>
                    </div>
                    <div className="font-medium">
                      {formatTime(order.scheduled_datetime)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {order.fuel_type}
                    </div>
                    <div className="font-bold text-primary">
                      {order.total_amount.toLocaleString()} UZS
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="w-24 flex flex-col items-center justify-center border-l py-3 bg-muted/30">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-semibold">
                    {['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun',
                      'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'][scheduledDate.getMonth()]}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {scheduledDate.getDate()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(order.scheduled_datetime)}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
