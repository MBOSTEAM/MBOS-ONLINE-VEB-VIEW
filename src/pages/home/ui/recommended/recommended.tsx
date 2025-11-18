import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import {
  useStations,
  type StationListItem,
} from "@/config/queries/stations/station.queries";
import { Link } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Initialize dayjs plugins
dayjs.extend(utc);

const baseURL = import.meta.env.VITE_API_URL_UPLOAD;

// Helper function to extract time from datetime string and convert to Uzbekistan time (+5 hours)
const extractTime = (dateTimeString: string): string => {
  if (!dateTimeString) return "";

  try {
    // Try to parse as ISO format (e.g., "2025-10-29T08:00:00.000Z" or "1970-01-01T13:00:00.000Z")
    if (dateTimeString.includes("T")) {
      const utcTime = dayjs.utc(dateTimeString);
      // Add 5 hours for Uzbekistan timezone (UTC+5)
      const uzbTime = utcTime.add(5, "hour");
      return uzbTime.format("HH:mm");
    }

    // Try space-separated format (e.g., "2025-10-29 08:00:00")
    const parts = dateTimeString.split(" ");
    if (parts.length >= 2) {
      // Parse as local time and add 5 hours
      const localTime = dayjs(dateTimeString);
      const uzbTime = localTime.add(5, "hour");
      return uzbTime.format("HH:mm");
    }

    // If it's just time format (e.g., "08:00:00" or "08:00")
    if (dateTimeString.includes(":")) {
      const timeOnly = dateTimeString.substring(0, 5);
      const [hours, minutes] = timeOnly.split(":").map(Number);
      let uzbHours = (hours + 5) % 24;
      return `${String(uzbHours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }

    return dateTimeString;
  } catch (error) {
    // Fallback: try to extract time from string
    const parts = dateTimeString.split(" ");
    if (parts.length >= 2) {
      const timePart = parts[1];
      return timePart.substring(0, 5);
    }
    return dateTimeString;
  }
};

export default function Recommended() {
  const { data: stationsData, isLoading } = useStations({ limit: 12 });

  if (isLoading) {
    return (
      <div className="flex gap-4 mt-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-muted animate-pulse h-64 w-64"
          />
        ))}
      </div>
    );
  }

  const allStations: StationListItem[] = stationsData?.data || [];
  const stations = allStations
    .filter((station: StationListItem) => station.is_open === true)
    .slice(0, 6);

  if (stations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Benzin kolonkalari topilmadi</p>
      </div>
    );
  }

  return (
    <div className=" max-w-xl mt-10">
      <Carousel className="w-full max-w-xl">
        <CarouselContent>
          {stations.map((station) => (
            <CarouselItem key={station.id}>
              <Link to={`/station/${station.id}`}>
                <div className="rounded-2xl overflow-hidden bg-muted shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={`${baseURL}/${station.preview_photos?.[0]?.url}`}
                        alt={station.title || "Station"}
                        className="w-full h-44 object-fit"
                      />
                      <Badge
                        className={`absolute top-3 left-3 ${
                          station.is_open
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        } hover:opacity-90`}
                      >
                        {station.is_open ? "OCHIQ" : "YOPIQ"}
                      </Badge>
                    </div>
                    <div className="p-4 bg-background">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-1 flex-1">
                          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                            {station.title || "Station"}
                          </h3>
                        </div>
                        <span className="font-semibold text-foreground ml-2">
                          {station.current_queue
                            ? `${station.current_queue} navbat `
                            : "navbat yo'q"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-base text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">
                          {station.address || "Manzil ko'rsatilmagan"}
                        </span>
                      </div>
                      {station.distance && (
                        <div className="flex items-center gap-1 text-base text-muted-foreground mt-1">
                          <span>
                            {(station.distance / 1000).toFixed(1)} km uzoqlikda
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-base font-medium text-foreground">
                            {station.rating ? station.rating.toFixed(1) : "0.0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-base font-bold text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {extractTime(station.work_time_today?.from || "")} -
                            {""}
                            {extractTime(
                              station.work_time_today?.to || ""
                            )}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
      </Carousel>
    </div>
  );
}
