import { ArrowLeft, Clock, Fuel, MapPin, Wallet, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderDetails } from "@/config/queries/orders/order.queries";
import { formatTz } from "@/shared/utils/time";
import { QRCodeSVG } from "qrcode.react";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, error } = useOrderDetails(id!);
  const order = data?.data;

  if (isLoading) {
    return (
      <div className="px-4 pt-6 max-w-xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-28 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    );
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
    );
  }

  return (
    <div className="px-4 pt-6 max-w-xl mx-auto">
      <header className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          Buyurtma #{order.order_number}
        </h1>
      </header>
      {order.qr_code && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <QrCode className="w-5 h-5" />
                <span className="font-medium">QR Code</span>
              </div>
              <div className="mb-4 w-full max-w-xs flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={order.qr_code}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="w-full h-full"
                />
              </div>
              <div className="text-center space-y-1">
                <div className="font-mono text-sm font-semibold text-primary">
                  {order.qr_code}
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center px-4">
                QR kodni stansiyada skaner qiling yoki buyurtma raqamini
                ko'rsating
              </div>
            </div>
          </CardContent>
        </Card>
      )}
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
              <div className="font-medium">
                {(order.station as any).service?.title ||
                  order.station.name ||
                  (order.station as any).title ||
                  "Noma'lum"}
              </div>
              <div className="text-xs text-muted-foreground">
                {order.station.address ||
                  (order.station as any).service?.address ||
                  "Manzil ko'rsatilmagan"}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Rejalashtirilgan</span>
            </div>
            <div className="font-medium">
              {formatTz(order.scheduled_datetime, "YYYY-MM-DD HH:mm")}
            </div>
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
              <div className="font-medium">
                {order.fuel_type.type || order.fuel_type.name || "Yoqilg'i"}
              </div>
              <div className="text-sm text-muted-foreground">
                Narx:{" "}
                {order.fuel_type.price
                  ? `${order.fuel_type.price.toLocaleString()} UZS/litr`
                  : "Narx ko'rsatilmagan"}
              </div>
            </div>
          </div>
          {order.refueling && order.refueling.type && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Turi</div>
                <div className="font-medium capitalize">
                  {order.refueling.type}
                </div>
              </div>
              {order.refueling.volume && order.refueling.volume > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Hajm</div>
                  <div className="font-medium">{order.refueling.volume} l</div>
                </div>
              )}
              {order.refueling.amount && order.refueling.amount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Summa</div>
                  <div className="font-medium">
                    {order.refueling.amount.toLocaleString()} UZS
                  </div>
                </div>
              )}
              {order.refueling.estimated_cost &&
                order.refueling.estimated_cost > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Taxminiy narx</div>
                    <div className="font-medium">
                      {order.refueling.estimated_cost.toLocaleString()} UZS
                    </div>
                  </div>
                )}
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
              <div className="font-medium capitalize">
                {order.payment.method}
              </div>
              <div className="text-xs text-muted-foreground">
                {order.payment.status}
              </div>
            </div>
          </div>
          {order.fees && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Band qilish to'lovi</div>
                <div className="font-medium">
                  {order.fees.booking_fee
                    ? order.fees.booking_fee.toLocaleString()
                    : "0"}{" "}
                  UZS
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Xizmat haqi</div>
                <div className="font-medium">
                  {order.fees.service_fee
                    ? order.fees.service_fee.toLocaleString()
                    : "0"}{" "}
                  UZS
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Jami</div>
                <div className="font-bold text-primary">
                  {order.fees.total ? order.fees.total.toLocaleString() : "0"}{" "}
                  UZS
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center mb-6">
        Yaratilgan: {formatTz(order.created_at, "YYYY-MM-DD HH:mm")}
      </div>
    </div>
  );
}
