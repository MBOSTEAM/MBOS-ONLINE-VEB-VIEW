// React import not required with the JSX transform
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Tabs, { TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"

type Order = {
  id: string
  status: "UPCOMING" | "CONFIRMED" | "WAITING" | "DECLINED"
  title: string
  subtitle: string
  desk?: string
  code?: string
  time?: string
  dateLabel?: string
}

const mockOrders: Order[] = [
  {
    id: "1",
    status: "UPCOMING",
    title: "Currency Exchange",
    subtitle: "Urgench Xalq Bank",
    desk: "Desk 4",
    code: "A23",
    time: "~ 13:25",
  },
  {
    id: "2",
    status: "CONFIRMED",
    title: "Gas station",
    subtitle: "Sanamjon Moylari",
    dateLabel: "JUL",
    code: "23",
    time: "15:45",
  },
  {
    id: "3",
    status: "WAITING",
    title: "Car washing",
    subtitle: "Urgench N1 Moyka",
    dateLabel: "JUL",
    code: "20",
    time: "15:45",
  },
  {
    id: "4",
    status: "DECLINED",
    title: "Home Cleaning",
    subtitle: "Tozalash xizmati",
    dateLabel: "JUL",
    code: "20",
    time: "15:45",
  },
]

function statusVariant(status: Order["status"]) {
  switch (status) {
    case "UPCOMING":
      return "default"
    case "CONFIRMED":
      return "secondary"
    case "WAITING":
      return "outline"
    case "DECLINED":
      return "destructive"
    default:
      return "default"
  }
}

export default function OrdersPage() {
  const [tab, setTab] = useState<string>("today")

  const filteredOrders = useMemo(() => {
    switch (tab) {
      case "confirmed":
        return mockOrders.filter((o) => o.status === "CONFIRMED")
      case "declined":
        return mockOrders.filter((o) => o.status === "DECLINED")
      case "yesterday":
        // Mock data: treat WAITING as yesterday for demo
        return mockOrders.filter((o) => o.status === "WAITING")
      case "today":
      default:
        return mockOrders.filter((o) => o.status === "UPCOMING" || o.status === "CONFIRMED" || o.status === "WAITING" || o.status === "DECLINED")
    }
  }, [tab])
  return (
    <div className="px-4 pt-6 max-w-xl mx-auto">
      <header className="flex items-center justify-between mb-4">
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
  {filteredOrders.map((o) => (
          <Card key={o.id} className="flex flex-row items-stretch">
            <div className="flex-1">
              <CardHeader className="py-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                </div>
                <div className="mt-1">
                  <CardTitle className="text-sm">{o.title}</CardTitle>
                  <CardDescription>{o.subtitle}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {/* left empty on purpose - content is in header */}
              </CardContent>
            </div>

    <div className="w-24 flex flex-col items-center justify-center border-l py-1.5">
              {o.dateLabel ? (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-semibold">{o.dateLabel}</div>
      <div className="text-lg font-bold">{o.code}</div>
      <div className="text-xs text-muted-foreground">{o.time}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{o.desk}</div>
      <div className="text-lg font-bold">{o.code}</div>
      <div className="text-xs text-muted-foreground">{o.time}</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
