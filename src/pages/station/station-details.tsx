import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Clock, 
  Share2, 
  Phone, 
  Globe, 
  Instagram, 
  Bookmark,
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Wifi,
  CreditCard,
  Fuel,
  Calendar,
  Users,
  Plus,
  Minus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStationDetails, useStationTimeSlots } from "@/config/queries/stations/station.queries";
import { useCreateOrder } from "@/config/queries/orders/order.queries";
import { useUserVehicles as useVehicles } from "@/config/queries/vehicles/vehicles.queries";

const StationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("About");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [refuelingType, setRefuelingType] = useState<'volume' | 'fill_in_amount'>('volume');
  const [refuelingVolume, setRefuelingVolume] = useState<number>(1);
  const [refuelingAmount, setRefuelingAmount] = useState<number>(1000);

  const { data: stationData, isLoading, error } = useStationDetails(id!);
  const { data: vehiclesData } = useVehicles();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  
  const { data: timeSlotsData } = useStationTimeSlots(id!, {
    date: selectedDate,
    fuel_type_id: selectedFuelType
  });

  // Mock data for time slots when API doesn't return data
  const mockTimeSlots = {
    data: {
      slots: [
        { time: "08:00", available: true, queue_length: 0, unit_id: null },
        { time: "08:30", available: true, queue_length: 1, unit_id: null },
        { time: "09:00", available: true, queue_length: 0, unit_id: null },
        { time: "09:30", available: false, queue_length: 3, unit_id: null },
        { time: "10:00", available: true, queue_length: 0, unit_id: null },
        { time: "10:30", available: true, queue_length: 2, unit_id: null },
        { time: "11:00", available: true, queue_length: 0, unit_id: null },
        { time: "11:30", available: false, queue_length: 4, unit_id: null },
        { time: "12:00", available: true, queue_length: 1, unit_id: null },
        { time: "12:30", available: true, queue_length: 0, unit_id: null },
        { time: "13:00", available: true, queue_length: 0, unit_id: null },
        { time: "13:30", available: false, queue_length: 2, unit_id: null },
        { time: "14:00", available: true, queue_length: 0, unit_id: null },
        { time: "14:30", available: true, queue_length: 1, unit_id: null },
        { time: "15:00", available: true, queue_length: 0, unit_id: null },
        { time: "15:30", available: false, queue_length: 3, unit_id: null },
        { time: "16:00", available: true, queue_length: 0, unit_id: null },
        { time: "16:30", available: true, queue_length: 2, unit_id: null },
        { time: "17:00", available: true, queue_length: 0, unit_id: null },
        { time: "17:30", available: false, queue_length: 5, unit_id: null },
        { time: "18:00", available: true, queue_length: 1, unit_id: null }
      ]
    }
  };

  // Use mock data if API doesn't return data
  const finalTimeSlotsData = timeSlotsData?.data?.slots && timeSlotsData.data.slots.length > 0 
    ? timeSlotsData 
    : mockTimeSlots;


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

    // Validation for refueling amount/volume
    if (refuelingType === 'volume' && refuelingVolume < 1) {
      return;
    }
    if (refuelingType === 'fill_in_amount' && refuelingAmount < 1000) {
      return;
    }

    // Create proper ISO datetime format
    const scheduledDateTime = `${selectedDate}T${selectedTimeSlot}:00.000Z`;
    
    
    createOrder({
      station_id: id!,
      fuel_type_id: selectedFuelType,
      unit_id: selectedUnit,
      vehicle_id: selectedVehicle,
      scheduled_datetime: scheduledDateTime,
      refueling_type: refuelingType,
      refueling_volume: refuelingType === 'volume' ? refuelingVolume : null,
      refueling_amount: refuelingType === 'fill_in_amount' ? refuelingAmount : null,
      payment_method: 'wallet',
      special_instructions: ''
    }, {
      onSuccess: () => {
        setShowBookingModal(false);
        navigate('/orders');
      }
    });
  };

  const tabs = ["About", "Services", "Time Slots", "Feedbacks"];

  // Helper function to extract time from datetime string
  const extractTime = (dateTimeString: string): string => {
    if (!dateTimeString) return ''
    const parts = dateTimeString.split(' ')
    if (parts.length >= 2) {
      const timePart = parts[1] // Get "HH:MM:SS"
      return timePart.substring(0, 5) // Return only "HH:MM"
    }
    return dateTimeString
  }


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
    <div className="max-w-xl mx-auto p-4">
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
        <Button variant="outline" size="icon" title="Ulashish">
          <Share2 className="w-5 h-5" />
        </Button>
        {station.phone && (
          <Button variant="outline" size="icon" title="Telefon">
            <Phone className="w-5 h-5" />
          </Button>
        )}
        <Button variant="outline" size="icon" title="Veb-sayt">
          <Globe className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" title="Instagram">
          <Instagram className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" title="Saqlash">
          <Bookmark className="w-5 h-5" />
        </Button>
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
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Fuel Type Selection */}
            {station.fuel_types && station.fuel_types.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Yoqilg'i turini tanlang</label>
                <select
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
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

          {/* Time Slots Display */}
          {selectedFuelType && finalTimeSlotsData?.data ? (
            <div className="mt-4">
              <h4 className="font-medium mb-3">Mavjud vaqtlar ({selectedDate})</h4>
              <div className="grid grid-cols-3 gap-2">
                {finalTimeSlotsData.data.slots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium border transition-colors ${slot.available
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                  >
                    <div>{slot.time}</div>
                    {slot.queue_length > 0 && (
                      <div className="text-xs opacity-75">
                        {slot.queue_length} navbat
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : selectedFuelType ? (
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

      {/* Order Button */}
      <Button 
        className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
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
                  onChange={(e) => setSelectedFuelType(e.target.value)}
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

              {/* Unit Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Birlik</label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Birlik tanlang</option>
                  {station.units?.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
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
                  {finalTimeSlotsData?.data?.slots && finalTimeSlotsData.data.slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {finalTimeSlotsData.data.slots.map((slot, index) => (
                        <button
                          key={index}
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-2 rounded-lg text-sm font-medium border transition-colors ${
                            selectedTimeSlot === slot.time
                              ? 'bg-primary text-primary-foreground'
                              : slot.available
                              ? 'bg-background hover:bg-muted'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
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
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRefuelingVolume(refuelingVolume + 1)}
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
                  />
                )}
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
                  disabled={isCreatingOrder || !selectedVehicle || !selectedFuelType || !selectedUnit || !selectedTimeSlot || (refuelingType === 'volume' && refuelingVolume < 1) || (refuelingType === 'fill_in_amount' && refuelingAmount < 1000)}
                >
                  {isCreatingOrder ? 'Yaratilmoqda...' : 'Band qilish'}
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