import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useOrders } from "@/config/queries/orders/order.queries"
import { Link } from "react-router-dom"

export default function BookingCard() {
  // Get confirmed, pending, in_progress, or customer_arrived orders
  const { data: ordersData, isLoading } = useOrders({ 
    page: 1, 
    limit: 5,
    sort_field: 'created_at',
    sort_order: 'desc'
  })
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-0 shadow-sm bg-muted py-1 mt-4">
        <div className="p-3">
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </Card>
    )
  }

  const orders = ordersData?.data || []
  // Filter for active orders (not completed, cancelled, or failed)
  const activeStatuses = new Set([
    'confirmed',
    'pending',
    'in_progress',
    'customer_arrived',
  ])

  const activeOrder: any = orders.find((order: any) => activeStatuses.has(order?.status))

  // If there are no active orders, show placeholder (same UI as before)
  if (orders.length === 0 || !activeOrder) {
    return (
      <Card className="overflow-hidden border-0 shadow-sm bg-muted py-3 mt-10">
        <div className="flex items-stretch">
          <div className="flex-1 p-3">
            <Badge className="bg-green-500 hover:bg-green-600 text-white mb-3 inline-block">CONFIRMED</Badge>
            <div>
              <h3 className="font-bold text-lg">Classic Hairstyle + Colorizing</h3>
              <p className="text-base text-muted-foreground mt-1">Gozallik saloni</p>
            </div>
          </div>

          <div className="w-px bg-border"></div>

          <div className="flex flex-col items-center justify-center px-4 py-3 min-w-fit">
            <div className="text-sm font-semibold text-foreground">JUL</div>
            <div className="text-3xl font-bold text-foreground leading-none">23</div>
            <div className="text-xs text-muted-foreground mt-2">15:45</div>
          </div>
        </div>
      </Card>
    ) // No active orders
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      'confirmed': { label: 'TASDIQLANDI', className: 'bg-green-500 hover:bg-green-600 text-white' },
      'pending': { label: 'KUTILMOQDA', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
      'completed': { label: 'TUGALLANDI', className: 'bg-blue-500 hover:bg-blue-600 text-white' },
      'cancelled': { label: 'BEKOR QILINDI', className: 'bg-red-500 hover:bg-red-600 text-white' },
      'in_progress': { label: 'DAVOM ETVOTGAN', className: 'bg-purple-500 hover:bg-purple-600 text-white' },
      'customer_arrived': { label: 'MUVAFFAQIYATLI', className: 'bg-green-500 hover:bg-green-600 text-white' },
      'no_show': { label: 'KELMADI', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
      'failed': { label: 'YARATILMADI', className: 'bg-red-500 hover:bg-red-600 text-white' },
    }
    return statusMap[status] || { label: status.toUpperCase(), className: 'bg-gray-500 text-white' }
  }

  const scheduledDate = new Date(activeOrder?.scheduled_datetime || Date.now())
  const month = scheduledDate.toLocaleString('ru-RU', { month: 'short' }).toUpperCase()
  const day = scheduledDate.getDate()
  const time = scheduledDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  
  const statusInfo = getStatusBadge(activeOrder.status)
  const stationName = activeOrder.station.name || activeOrder.station.address || 'Station'

  return (
    <Link to={`/orders/${activeOrder.id}`}>
      <Card className="overflow-hidden border-0 shadow-sm bg-muted py-1 mt-4 cursor-pointer hover:bg-muted/80 transition-colors">
        <div className="flex items-stretch">
          <div className="flex-1 p-3">
            <Badge className={`${statusInfo.className} mb-3 inline-block`}>
              {statusInfo.label}
            </Badge>
            <div>
              <h3 className="font-bold text-lg">{activeOrder.fuel_type}</h3>
              <p className="text-base text-muted-foreground mt-1">{stationName}</p>
            </div>
          </div>

          <div className="w-px bg-border"></div>

          <div className="flex flex-col items-center justify-center px-4 py-3 min-w-fit">
            <div className="text-sm font-semibold text-foreground">{month}</div>
            <div className="text-3xl font-bold text-foreground leading-none">{day}</div>
            <div className="text-xs text-muted-foreground mt-2">{time}</div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
