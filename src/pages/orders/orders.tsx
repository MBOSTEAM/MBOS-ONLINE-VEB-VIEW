import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Menu, ArrowLeft, Clock, MapPin, Fuel } from "lucide-react"
import Tabs, { TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useOrders } from "@/config/queries/orders/order.queries"


export default function OrdersPage() {
  const [tab, setTab] = useState<string>("today")
  
  // Fetch orders from API
  const { data: ordersData, isLoading, error } = useOrders()

  // Helper function to get status variant
  function statusVariant(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return "default"
      case "confirmed":
        return "secondary"
      case "customer_arrived":
      case "in_progress":
        return "outline"
      case "completed":
        return "secondary"
      case "cancelled":
      case "failed":
      case "no_show":
        return "destructive"
      default:
        return "default"
    }
  }

  // Helper function to format date
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

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  // Filter orders based on tab
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

  // Loading state
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

  // Error state
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

  // No data state
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
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className="text-xl font-semibold">Orders</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon-lg" aria-label="filter"><Menu size={30}/></Button>
        </div>
      </header>

      <nav className="mb-4">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex gap-2 overflow-x-auto">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </div>
        </Tabs>
      </nav>

      <section className="flex flex-col gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="flex flex-row items-stretch">
            <div className="flex-1">
              <CardHeader className="py-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    {order.station.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {order.station.address}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(order.scheduled_datetime)}
                  </div>
                  <div>
                    {order.fuel_type} - {order.total_amount.toLocaleString()} UZS
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="w-24 flex flex-col items-center justify-center border-l py-1.5">
              <div className="text-center">
                <div className="text-xs text-muted-foreground font-semibold">
                  {new Date(order.scheduled_datetime).toLocaleDateString('en-US', { 
                    month: 'short' 
                  }).toUpperCase()}
                </div>
                <div className="text-lg font-bold">
                  {new Date(order.scheduled_datetime).getDate()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(order.scheduled_datetime)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
