import React from 'react'
import { Link } from 'react-router-dom'

const VehicleRow: React.FC<{
  title: string
  plate: string
  color?: string
  secondary?: string
}> = ({ title, plate, color = 'White', secondary }) => {
  return (
    <div className="flex items-center justify-between bg-[#f3f6f7] rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400">
          <svg width="18" height="12" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12h20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8L6 5H18L20 8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground">{title}</div>
          {secondary && (
            <div className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">{secondary}</div>
          )}
        </div>
      </div>

      <div className="text-right">
        <div className="font-semibold text-sm">{plate}</div>
        <div className="text-sm text-muted-foreground">{color}</div>
      </div>
    </div>
  )
}

type MockVehicle = {
  id: string
  title: string
  plate: string
  color: string
  badge?: string
}

const MOCK: MockVehicle[] = [
  { id: '1', title: 'Chevrolet Cobalt', plate: '90 A123 NN', color: 'White' },
  { id: '2', title: 'Chevrolet Cobalt', plate: '90 A123 NN', color: 'White', badge: 'Uz Trans Group' },
]

export default function Vehicles() {
  return (
    <div className="max-w-lg mx-auto p-4 space-y-4 bg-background min-h-screen">
      <div className="flex items-center gap-4">
        <Link to="/profile" className="p-2 rounded-full bg-muted">
          {/* back icon placeholder */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h1 className="text-lg font-semibold">Vehicles</h1>
      </div>

      <p className="text-sm text-muted-foreground">Add your vehicle for order gas stations</p>

      <div className="space-y-4">
        {MOCK.map((v) => (
          <VehicleRow key={v.id} title={v.title} plate={v.plate} color={v.color} secondary={v.badge} />
        ))}
      </div>

      <div className="fixed left-0 right-0 bottom-6 mx-auto max-w-lg px-4">
        <Link to="/vehicles/add" className="w-full block">
          <button className="w-full bg-black text-white py-3 rounded-lg font-medium">Add Vehicle</button>
        </Link>
      </div>
    </div>
  )
}
