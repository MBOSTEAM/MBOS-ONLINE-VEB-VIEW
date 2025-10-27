import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle } from "lucide-react"

export default function Recommended() {
  return (
      <div className="max-w-xs rounded-2xl overflow-hidden bg-muted shadow-sm border border-border mt-10 ">
      {/* Image section */}
      <div className="relative">
        <img
          src="./barber.png"
          alt="Barber"
          className="w-full h-44 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-green-500 text-white hover:bg-green-600">
          OPEN
        </Badge>
      </div>

      {/* Info section */}
      <div className="p-4 bg-background">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-lg text-foreground">
              Samandar Barber
            </h3>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-semibold text-foreground">8–24 $</span>
        </div>

        <div className="flex justify-between text-base text-muted-foreground mt-1">
          <span>New York · 300 m</span>
          <span>10:30 – 20:30</span>
        </div>

        <div className="flex items-center gap-1 mt-2 mb-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-foreground">4.5</span>
        </div>
      </div>
    </div>
  )
}
