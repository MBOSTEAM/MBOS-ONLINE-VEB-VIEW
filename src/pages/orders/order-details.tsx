import { ArrowLeft, Clock, Fuel, MapPin, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate, useParams } from "react-router-dom"
import { useOrderDetails } from "@/config/queries/orders/order.queries"
import { formatTz } from "@/shared/utils/time"

export default function OrderDetailsPage() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { data, isLoading, error } = useOrderDetails(id!)
    const order = data?.data

    if (isLoading) {
        return (
            <div className="px-4 pt-6 max-w-xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="h-28 bg-muted rounded" />
                    <div className="h-24 bg-muted rounded" />
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="px-4 pt-6 max-w-xl mx-auto text-center">
                <div className="text-red-500 mb-4">
                    <h3 className="text-lg font-semibold">Xatolik yuz berdi</h3>
                    <p className="text-sm">Buyurtma ma'lumotlarini yuklashda muammo</p>
                </div>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Orqaga
                </Button>
            </div>
        )
    }

    return (
        <div className="px-4 pt-6 max-w-xl mx-auto">
            <header className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-semibold">Buyurtma #{order.order_number}</h1>
            </header>

            <Card className="mb-4">
                <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground">Holat</div>
                        <div className="font-medium capitalize">{order.status}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>Stansiya</span>
                        </div>
                        <div className="text-right">
                            <div className="font-medium">{order.station.name}</div>
                            <div className="text-xs text-muted-foreground">{order.station.address}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Rejalashtirilgan</span>
                        </div>
                        <div className="font-medium">{formatTz(order.scheduled_datetime, 'YYYY-MM-DD HH:mm')}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Fuel className="w-4 h-4" />
                            <span>Yoqilg'i</span>
                        </div>
                        <div className="text-right">
                            <div className="font-medium">{order.fuel_type.type}</div>
                            <div className="text-sm text-muted-foreground">Narx: {order.fuel_type.price.toLocaleString()} UZS</div>
                        </div>
                    </div>
                    {order.refueling && (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Turi</div>
                                <div className="font-medium">{order.refueling.type}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Hajm</div>
                                <div className="font-medium">{order.refueling.volume ?? '-'}{order.refueling.volume ? ' l' : ''}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Summa</div>
                                <div className="font-medium">{order.refueling.amount != null ? `${order.refueling.amount.toLocaleString()} UZS` : '-'}</div>
                            </div>
                            {/* <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Taxminiy narx</div>
                    <div className="font-medium">{order.refueling.estimated_cost.toLocaleString()} UZS</div>
                </div> */}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wallet className="w-4 h-4" />
                            <span>To'lov</span>
                        </div>
                        <div className="text-right">
                            <div className="font-medium capitalize">{order.payment.method}</div>
                            <div className="text-xs text-muted-foreground">{order.payment.status}</div>
                        </div>
                    </div>
                    {order.payment && (order as any).fees && (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Band qilish to'lovi</div>
                                <div className="font-medium">{(order as any).fees.booking_fee.toLocaleString()} UZS</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Xizmat haqi</div>
                                <div className="font-medium">{(order as any).fees.service_fee.toLocaleString()} UZS</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground">Jami</div>
                                <div className="font-bold text-primary">{(order as any).fees.total.toLocaleString()} UZS</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground text-center">
                Yaralgan: {formatTz(order.created_at, 'YYYY-MM-DD HH:mm')}
            </div>
        </div>
    )
}


