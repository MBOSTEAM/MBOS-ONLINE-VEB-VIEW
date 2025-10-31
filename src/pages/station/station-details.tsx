import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Instagram,
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Wifi,
  CreditCard,
  Fuel,
  Calendar,
  Users,
  Plus,
  Minus,
  MessageCircle
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { timeToTashkentISO, displayTimeTashkent, formatTz } from '@/shared/utils/time'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStationDetails, useStationTimeSlots } from "@/config/queries/stations/station.queries";
import { useCreateOrder, useOrders } from "@/config/queries/orders/order.queries";
import { useUserVehicles as useVehicles } from "@/config/queries/vehicles/vehicles.queries";
import { useServiceFeedback, useSubmitServiceFeedback } from "@/config/queries/feedback/feedback.queries";
import type { ActualServiceFeedbackResponse } from "@/config/queries/feedback/feedback.queries";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const StationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("About");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDateAll, setSelectedDateAll] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedFuelTypeAll, setSelectedFuelTypeAll] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [refuelingType, setRefuelingType] = useState<'volume' | 'fill_in_amount'>('volume');
  const [refuelingVolume, setRefuelingVolume] = useState<number>(1);
  const [refuelingAmount, setRefuelingAmount] = useState<number>(1000);
  const [payViaSystem, setPayViaSystem] = useState<boolean>(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const { data: stationData, isLoading, error } = useStationDetails(id!);
  const { data: vehiclesData } = useVehicles();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { data: feedbacksData, isLoading: isLoadingFeedbacks } = useServiceFeedback(stationData?.data.service_id!, { page: 1, limit: 10 }) as { data: ActualServiceFeedbackResponse | undefined, isLoading: boolean };
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useSubmitServiceFeedback();
  const { data: ordersData } = useOrders({ status: 'confirmed', station_id: id!, limit: 50 });

  const { data: timeSlotsData } = useStationTimeSlots(id!, {
    date: selectedDate,
    all: false,
    fuel_type_id: selectedFuelType
  });

  const { data: timeSlotsDataAll } = useStationTimeSlots(id!, {
    date: selectedDateAll,
    all: true,
    fuel_type_id: selectedFuelTypeAll
  });
  // Filter orders for this specific station
  const stationOrders = ordersData?.data?.filter(order => order.station.id === id) || [];

  const handleBack = () => {
    navigate("/");
  };

  const handleBookingClick = () => {
    if (!station.is_open) return;
    setShowBookingModal(true);
  };

  const handleCreateOrder = () => {
    if (!selectedVehicle || !selectedFuelType || !selectedUnit || !selectedTimeSlot) {
      return;
    }

    // Validation for refueling amount/volume only when paying via system
    if (payViaSystem) {
      if (refuelingType === 'volume' && refuelingVolume < 1) {
        return;
      }
      if (refuelingType === 'fill_in_amount' && refuelingAmount < 1000) {
        return;
      }
    }

    // Compose selected date with slot time in Asia/Tashkent and keep +05:00 offset
    const scheduledDateTime = timeToTashkentISO(displayTimeTashkent(selectedTimeSlot), selectedDate);

    createOrder({
      station_id: id!,
      fuel_type_id: selectedFuelType,
      unit_id: selectedUnit,
      vehicle_id: selectedVehicle,
      scheduled_datetime: scheduledDateTime,
      refueling_type: payViaSystem ? refuelingType : null,
      refueling_volume: payViaSystem && refuelingType === 'volume' ? refuelingVolume : null,
      refueling_amount: payViaSystem && refuelingType === 'fill_in_amount' ? refuelingAmount : null,
      payment_method: 'wallet',
      special_instructions: ''
    }, {
      onSuccess: () => {
        setShowBookingModal(false);
        navigate('/orders');
      }
    });
  };

  const handleSubmitFeedback = () => {
    if (!feedbackComment.trim() || !selectedOrderId) {
      return;
    }

    submitFeedback({
      serviceId: stationData?.data.service_id!,
      rating: feedbackRating,
      comment: feedbackComment,
      order_id: selectedOrderId
    }, {
      onSuccess: () => {
        setShowFeedbackForm(false);
        setFeedbackComment('');
        setSelectedOrderId('');
        setFeedbackRating(5);
      }
    });
  };

  console.log(stationOrders);

  const tabs = ["About", "Services", "Time Slots", "Feedbacks"];

  // Helper: extract time in Asia/Tashkent (HH:mm)
  const extractTime = (dateTimeString: string): string => displayTimeTashkent(dateTimeString)

  // Helper: format slot time to HH:mm in Asia/Tashkent
  const formatTimeSlot = (isoTimeString: string): string => displayTimeTashkent(isoTimeString)


  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-6 w-6 bg-muted rounded mb-4" />
          <div className="h-48 bg-muted rounded-xl mb-4" />
          <div className="h-6 bg-muted rounded mb-2" />
          <div className="h-4 bg-muted rounded mb-2" />
          <div className="h-4 bg-muted rounded mb-4" />
          <div className="h-8 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded mb-4" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4 text-center">
        <div className="text-red-500 mb-4">
          <h3 className="text-lg font-semibold">Xatolik yuz berdi</h3>
          <p className="text-sm">Benzin kolonkasi ma'lumotlarini yuklashda muammo</p>
        </div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga qaytish
        </Button>
      </div>
    );
  }

  // No data state
  if (!stationData?.data) {
    return (
      <div className="max-w-xl mx-auto p-4 text-center">
        <div className="text-muted-foreground mb-4">
          <h3 className="text-lg font-semibold">Benzin kolonkasi topilmadi</h3>
          <p className="text-sm">Kechirasiz, bu benzin kolonkasi mavjud emas</p>
        </div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga qaytish
        </Button>
      </div>
    );
  }

  const station = stationData.data;
  const baseURL = import.meta.env.VITE_API_URL_UPLOAD;

  return (
    <div className="max-w-xl mx-auto p-2">
      <button className="mb-4" onClick={handleBack}>
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Station Image */}
      <div className="rounded-xl overflow-hidden mb-4">
        <img
          src={station.preview_photos?.[0]?.url ? `${baseURL}/${station.preview_photos[0].url}` : "/barber.png"}
          alt={station.title || 'Station'}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Station Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{station.title || 'Benzin kolonkasi'}</h2>
        <Badge
          variant="outline"
          className={`font-medium ${station.is_open ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          {station.is_open ? 'OCHIQ' : 'YOPIQ'}
        </Badge>
      </div>

      {/* Address */}
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <MapPin className="w-4 h-4" />
        <span>{station.address || 'Manzil ko\'rsatilmagan'}</span>
      </div>

      {/* Work Time */}
      {station.work_time_today && (
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Clock className="w-4 h-4" />
          <span>
            {extractTime(station.work_time_today.from || '')} - {extractTime(station.work_time_today.to || '')}
          </span>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{station.rating ? station.rating.toFixed(1) : '0.0'}</span>
        <span className="text-sm text-muted-foreground">({station.reviews_count} sharh)</span>
      </div>

      {/* Queue Info */}
      {station.current_queue && station.current_queue > 0 && (
        <div className="flex items-center gААap-2 text-orange-600 mb-4">
          <Users className="w-4 h-4" />
          <span className="font-medium">{station.current_queue} navbat</span>
        </div>
      )}
      {/* Tabs */}
      <div className="flex justify-between mb-4 border-b">
        <div className="flex gap-8 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-4 -mb-[17px] ${activeTab === tab
                ? "border-b-2 border-primary"
                : "text-muted-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mb-6 border-b pb-4">
        {station.phone && (
          <Button
            variant="outline"
            size="icon"
            title="Telefon"
            className="w-full"
            onClick={() => window.open(`tel:${station.phone}`, '_self')}
          >
            <Phone className="w-5 h-5" />
          </Button>
        )}
        {(station as any).website && (
          <Button
            variant="outline"
            size="icon"
            title="Veb-sayt"
            className="w-full"
            onClick={() => window.open((station as any).website, '_blank')}
          >
            <Globe className="w-5 h-5" />
          </Button>
        )}
        {(station as any).instagram && (
          <Button
            variant="outline"
            size="icon"
            title="Instagram"
            className="w-full"
            onClick={() => window.open((station as any).instagram, '_blank')}
          >
            <Instagram className="w-5 h-5" />
          </Button>
        )}
        {(station as any).telegram && (
          <Button
            variant="outline"
            size="icon"
            title="Telegram"
            className="w-full"
            onClick={() => window.open((station as any).telegram, '_blank')}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "About" && (
        <>
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-2">Haqida</h3>
            <p className="text-muted-foreground">
              {station.description || 'Bu benzin kolonkasi haqida ma\'lumot yo\'q.'}
            </p>
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-2">Manzil</h3>
            <p className="text-muted-foreground">
              {station.address || 'Manzil ko\'rsatilmagan'}
            </p>
            {station.latitude && station.longitude && (
              <p className="text-xs text-muted-foreground mt-1">
                Koordinatalar: {station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-2">Ish vaqti</h3>
            <div className="space-y-2 text-muted-foreground">
              {station.work_times?.map((workTime, index) => {
                const dayNames = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
                const dayName = dayNames[workTime.day_of_week] || `Kun ${workTime.day_of_week}`;

                return (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {dayName}: {extractTime(workTime.from_time)} - {extractTime(workTime.to_time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-b pb-4 mb-6">
            <h3 className="font-semibold mb-3">Xizmatlar</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Avtoturargoh
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Mini do'kon
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" /> Kafe
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" /> Wi-Fi
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Bankomat
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "Services" && (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Yoqilg'i turlari</h3>
          {station.fuel_types && Array.isArray(station.fuel_types) && station.fuel_types.length > 0 ? (
            station.fuel_types.map((fuel) => {
              // Safe data extraction
              const fuelName = fuel.type?.name || 'Noma\'lum';
              const fuelType = fuel.type?.code || 'Noma\'lum';

              const fuelPrice = typeof fuel.price === 'number' ? fuel.price : 0;
              const bookingFee = typeof fuel.booking_fee === 'number' ? fuel.booking_fee : 0;
              const isAvailable = Boolean(fuel.available);

              return (
                <div key={fuel.id || Math.random()} className="border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">{fuelName}</h4>
                      <Badge variant={isAvailable ? "default" : "secondary"}>
                        {isAvailable ? "Mavjud" : "Mavjud emas"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{fuelPrice.toLocaleString()} UZS</div>
                      <div className="text-sm text-muted-foreground">1 litr</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Band qilish to'lovi: {bookingFee.toLocaleString()} UZS</span>
                    <span className="text-xs">{fuelType}</span>
                  </div>

                  {/* Station Units */}
                  {station.units && Array.isArray(station.units) && station.units.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <h5 className="text-sm font-medium mb-2">Mavjud birliklar:</h5>
                      <div className="flex flex-wrap gap-2">
                        {station.units.map((unit) => (
                          <Badge
                            key={unit.id || Math.random()}
                            variant={Boolean(unit.available) ? "outline" : "secondary"}
                            className="text-xs"
                          >
                            {unit.name || 'Noma\'lum'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Fuel className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Yoqilg'i turlari mavjud emas</p>
            </div>
          )}
        </div>
      )}
      {activeTab === "Time Slots" && (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Vaqt bo'shliqlari</h3>

          {/* Date Selection */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Sana tanlang</label>
              <input
                type="date"
                value={selectedDateAll}
                onChange={(e) => setSelectedDateAll(e.target.value)}
                className="w-full p-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Fuel Type Selection */}
            {station.fuel_types && station.fuel_types.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Yoqilg'i turini tanlang</label>
                <select
                  value={selectedFuelTypeAll}
                  onChange={(e) => setSelectedFuelTypeAll(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Yoqilg'i turini tanlang</option>
                  {station.fuel_types.map((fuel) => {
                    const fuelName = fuel.type?.name || 'Noma\'lum';
                    const fuelPrice = typeof fuel.price === 'number' ? fuel.price : 0;

                    return (
                      <option key={fuel.id || Math.random()} value={fuel.type?.id}>
                        {fuelName} - {fuelPrice.toLocaleString()} UZS
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {selectedFuelTypeAll && timeSlotsDataAll?.data ? (
            <div className="mt-4">
              <h4 className="font-medium mb-3">Mavjud vaqtlar ({selectedDate})</h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlotsDataAll.data.slots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium border transition-colors ${slot.available
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                  >
                    <div>{formatTimeSlot(slot.time)}</div>
                    {slot.queue_length > 0 && (
                      <div className="text-xs opacity-75">
                        {slot.queue_length} navbat
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : selectedFuelTypeAll ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Bu kunda vaqt bo'shliqlari mavjud emas</p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Vaqt bo'shliqlarini ko'rish uchun yoqilg'i turini tanlang</p>
            </div>
          )}
        </div>
      )}
      {activeTab === "Feedbacks" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Fikr-mulohazalar</h3>
            <Button
              variant="outline"
              size="sm"

              onClick={() => setShowFeedbackForm(true)}
              disabled={stationOrders.length === 0}
            >
              <MessageCircle className="w-4 h-4 " />
              Fikr qoldirish
            </Button>
          </div>

          {feedbacksData?.data?.feedbacks && feedbacksData.data.feedbacks.length > 0 && (
            <div className="bg-card p-4 rounded-lg border mb-4">
              {(() => {
                const feedbacks = feedbacksData.data.feedbacks;
                const totalReviews = feedbacks.length;
                const averageRating = feedbacks.reduce((sum: number, feedback: any) => sum + feedback.rating, 0) / totalReviews;
                const ratingDistribution = {
                  '5': feedbacks.filter((f: any) => f.rating === 5).length,
                  '4': feedbacks.filter((f: any) => f.rating === 4).length,
                  '3': feedbacks.filter((f: any) => f.rating === 3).length,
                  '2': feedbacks.filter((f: any) => f.rating === 2).length,
                  '1': feedbacks.filter((f: any) => f.rating === 1).length,
                };

                return (
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalReviews} ta sharh
                      </div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <span className="text-sm w-3">{rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${(ratingDistribution[rating.toString() as keyof typeof ratingDistribution] / totalReviews) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {ratingDistribution[rating.toString() as keyof typeof ratingDistribution]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Feedbacks List */}
          {isLoadingFeedbacks ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded" />
              </div>
            </div>
          ) : feedbacksData?.data?.feedbacks && feedbacksData.data.feedbacks.length > 0 ? (
            <div className="space-y-4">
              {feedbacksData.data.feedbacks.map((feedback: any) => (
                <div key={feedback.id} className="bg-card p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{feedback.rating}/5</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTz(feedback.created_at, 'YYYY-MM-DD')}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {feedback.comment}
                  </p>
                  {feedback.user && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{feedback.user.full_name}</span>
                      {feedback.order && (
                        <span>• Buyurtma: {feedback.order.order_number}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Hozircha fikr-mulohaza yo'q</p>
              <p className="text-sm">Birinchi fikr-mulohazani siz qoldiring!</p>
            </div>
          )}
        </div>
      )}

      {/* Order Button */}
      <Button
        className="w-full py-6 text-lg bg-primary hover:bg-primary/90 mt-4"
        disabled={!station.is_open}
        onClick={handleBookingClick}
      >
        {station.is_open ? 'Band qilish' : 'Hozircha band qilib bo\'lmaydi'}
      </Button>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Band qilish</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBookingModal(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {/* Vehicle Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Transport vositasi</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Transport vositasi tanlang</option>
                  {vehiclesData?.data?.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plate_number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Yoqilg'i turi</label>
                <select
                  value={selectedFuelType}
                  onChange={(e) => { setSelectedFuelType(e.target.value); setSelectedUnit(''); }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Yoqilg'i turini tanlang</option>
                  {station.fuel_types?.map((fuel) => (
                    <option key={fuel.id} value={fuel.type?.id}>
                      {fuel.type?.name} - {fuel.price.toLocaleString()} UZS
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Selection (manual) */}
              <div>
                <label className="text-sm font-medium mb-2 block">Birlik</label>
                {(() => {
                  const units = (station.units || []) as Array<any>
                  const unitsToShow = selectedFuelType
                    ? units.filter(u => Array.isArray(u.supported_options) && u.supported_options.includes(selectedFuelType))
                    : units

                  return (
                    <>
                      <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        disabled={!selectedFuelType || unitsToShow.length === 0}
                      >
                        <option value="">Birlik tanlang</option>
                        {unitsToShow.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedFuelType
                          ? (unitsToShow.length === 0 ? 'Bu yoqilg\'i turi uchun mos birliklar topilmadi' : 'Yoqilg\'i turiga mos birliklarni tanlang')
                          : 'Avval yoqilg\'i turini tanlang, so\'ng birlikni belgilang'}
                      </p>
                    </>
                  )
                })()}
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sana</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time Slot Selection */}
              {selectedFuelType && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Vaqt</label>
                  {timeSlotsData?.data?.slots && timeSlotsData.data.slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlotsData.data.slots.map((slot, index) => (
                        <button
                          key={index}
                          disabled={!slot.available}
                          onClick={() => {
                            setSelectedTimeSlot(slot.time);
                          }}
                          className={`p-2 rounded-lg text-sm font-medium border transition-colors ${selectedTimeSlot === slot.time
                            ? 'bg-primary text-primary-foreground'
                            : slot.available
                              ? 'bg-background hover:bg-muted'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                        >
                          {formatTimeSlot(slot.time)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Bu kunda vaqt bo'shliqlari mavjud emas</p>
                    </div>
                  )}
                </div>
              )}

              {/* Refueling Type */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    id="pay-via-system"
                    type="checkbox"
                    checked={payViaSystem}
                    onChange={(e) => setPayViaSystem(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="pay-via-system" className="text-sm select-none">
                    Yoqilg'ini tizim orqali to'lash
                  </label>
                </div>
                {
                  payViaSystem && (
                    <div className="">



                      <label className="text-sm font-medium mb-2 block">Yoqilg'i miqdori</label>
                      <div className="flex gap-2 mb-2">
                        <Button
                          variant={refuelingType === 'volume' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setRefuelingType('volume')}
                        >
                          Litr
                        </Button>
                        <Button
                          variant={refuelingType === 'fill_in_amount' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setRefuelingType('fill_in_amount')}
                        >
                          Summa
                        </Button>
                      </div>

                      {refuelingType === 'volume' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRefuelingVolume(Math.max(1, refuelingVolume - 1))}
                            disabled={!payViaSystem}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <input
                            type="number"
                            value={refuelingVolume}
                            onChange={(e) => setRefuelingVolume(Number(e.target.value))}
                            className="w-full p-2 border rounded-md text-center"
                            min="1"
                            placeholder="Litr"
                            disabled={!payViaSystem}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRefuelingVolume(refuelingVolume + 1)}
                            disabled={!payViaSystem}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={refuelingAmount}
                          onChange={(e) => setRefuelingAmount(Number(e.target.value))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Summa kiriting (UZS)"
                          min="1000"
                          disabled={!payViaSystem}
                        />
                      )}
                    </div>
                  )
                }
              </div>


              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBookingModal(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateOrder}
                  disabled={
                    isCreatingOrder ||
                    !selectedVehicle ||
                    !selectedFuelType ||
                    !selectedUnit ||
                    !selectedTimeSlot ||
                    (payViaSystem && (
                      (refuelingType === 'volume' && refuelingVolume < 1) ||
                      (refuelingType === 'fill_in_amount' && refuelingAmount < 1000)
                    ))
                  }
                >
                  {isCreatingOrder ? 'Yaratilmoqda...' : 'Band qilish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Fikr qoldirish</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFeedbackForm(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              {/* Order Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Buyurtma tanlang</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Buyurtma tanlang</option>
                  {stationOrders.length > 0 ? (
                    stationOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.order_number} | {formatTz(order.scheduled_datetime, 'YYYY-MM-DD')} {formatTz(order.scheduled_datetime, 'HH:mm')} - {order.fuel_type}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Bu stansiya uchun tugallangan buyurtmalar yo'q
                    </option>
                  )}
                </select>
                {stationOrders.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Fikr qoldirish uchun avval bu stansiyada buyurtma tugatishingiz kerak
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Baholash</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className={`p-1 rounded ${star <= feedbackRating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    >
                      <Star
                        className={`w-6 h-6 ${star <= feedbackRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {feedbackRating}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm font-medium mb-2 block">Fikr-mulohaza</label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full p-2 border rounded-md h-24 resize-none"
                  placeholder="Fikr-mulohazangizni yozing..."
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {feedbackComment.length}/500
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowFeedbackForm(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback || !feedbackComment.trim() || !selectedOrderId}
                >
                  {isSubmittingFeedback ? 'Yuborilmoqda...' : 'Yuborish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDetails;