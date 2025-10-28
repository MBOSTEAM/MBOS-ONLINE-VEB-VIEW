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
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StationDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("About");

  const handleBack = () => {
    navigate("/");
  };

  const tabs = ["About", "Stories", "Services", "Feedbacks"];

  return (
    <div className="max-w-xl mx-auto p-4">
      <button className="mb-4" onClick={handleBack}>
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="rounded-xl overflow-hidden mb-4">
        <img src="/barber.png" alt="Station" className="w-full h-48 object-cover" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Sanamjon Moylari</h2>
        <Badge variant="outline" className="bg-green-100 text-green-600 font-medium">OPEN</Badge>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <MapPin className="w-4 h-4" /> 
        <span>New York · 300 m</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Clock className="w-4 h-4" />
        <span>10:30 - 20:30</span>
      </div>
      <div className="flex items-center gap-1 mb-4">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">4.5</span>
      </div>
      <div className="flex justify-between mb-4 border-b">
        <div className="flex gap-8 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-4 -mb-[17px] ${
                activeTab === tab
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between mb-6 border-b pb-4">
        <Button variant="outline" size="icon">
          <Share2 className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Globe className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Instagram className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Bookmark className="w-5 h-5" />
        </Button>
      </div>
      
      {activeTab === "About" && (
        <>
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">
              Sanamjon Moylari — siz uchun eng zo'r moylarni taqdim etadi. Toychoqni moylang - mazza qiling!
            </p>
          </div>
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-muted-foreground">
              Urgench, Broiler. 30 dom, 50 kv
            </p>
          </div>
          <div className="border-b pb-4 mb-6">
            <h3 className="font-semibold mb-3">Facilities</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Parking
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Mini market / Shop
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" /> Café / Coffee machine
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" /> Wi-Fi
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> ATM
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "Stories" && (
        <div className="text-center py-8 text-muted-foreground">
          Coming soon...
        </div>
      )}
      {activeTab === "Services" && (
        <div className="text-center py-8 text-muted-foreground">
          Coming soon...
        </div>
      )}
      {activeTab === "Feedbacks" && (
        <div className="text-center py-8 text-muted-foreground">
          Coming soon...
        </div>
      )}
      
      <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90">
        Order station
      </Button>
    </div>
  );
};

export default StationDetails;