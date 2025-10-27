import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function BookingCard() {
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
  )
}
