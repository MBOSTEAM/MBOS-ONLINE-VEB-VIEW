import { Scissors, Fuel, Landmark,BrushCleaning } from "lucide-react";

export default function ServiceCategories() {
  const services = [
    { name: "Barbershop", icon: Scissors },
    { name: "Gas station", icon: Fuel },
    { name: "Cleaners", icon: BrushCleaning  },
    { name: "Bank", icon: Landmark },
  ];

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center justify-center w-18 h-18 rounded-2xl bg-muted">
              <service.icon className="w-8 h-8 text-foreground" />
            </div>
            <span className="text-sm font-medium text-center text-foreground">
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
