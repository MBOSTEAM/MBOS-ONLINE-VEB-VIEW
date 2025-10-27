import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, MapPin, Clock } from "lucide-react"
import { useStations, type StationListItem } from "@/config/queries/stations/station.queries"
import { Link } from "react-router-dom"
const baseURL = import.meta.env.VITE_API_URL_UPLOAD

export default function Recommended() {
  const { data: stationsData, isLoading } = useStations({ limit: 12 })


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-muted animate-pulse h-64" />
        ))}
      </div>
    )
  }

  const allStations: StationListItem[] = stationsData?.data || []
  const stations = allStations.filter((station: StationListItem) => station.is_open === true).slice(0, 6)

  if (stations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Benzin kolonkalari topilmadi</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {stations.map((station) => (
        <Link key={station.id} to={`/stations/${station.id}`}>
          <div className="rounded-2xl overflow-hidden bg-muted shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
            {/* Image section */}
            <div className="relative">
              <img
                src={`${baseURL}/${station.preview_photos?.[0]?.url}`}
                alt={station.title || 'Station'}
                className="w-full h-44 object-cover"
              />
              <Badge className={`absolute top-3 left-3 ${station.is_open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} hover:opacity-90`}>
                {station.is_open ? 'OCHIQ' : 'YOPIQ'}
              </Badge>
            </div>

            {/* Info section */}
            <div className="p-4 bg-background">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-1 flex-1">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                    {station.title || 'Station'}
                  </h3>
                  {station.rating && station.rating >= 4.5 && (
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                  )}
                </div>
                <span className="font-semibold text-foreground ml-2">
                  {station.current_queue && station.current_queue > 0 && `${station.current_queue} navbat`}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{station.address || 'Manzil ko\'rsatilmagan'}</span>
              </div>

              {station.distance && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <span>{(station.distance / 1000).toFixed(1)} km uzoqlikda</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {station.rating ? station.rating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({station.reviews_count || 0})
                  </span>
                </div>
                {station.estimated_wait && station.estimated_wait > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{station.estimated_wait} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
