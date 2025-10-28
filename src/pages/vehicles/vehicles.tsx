import React from 'react'
import { Link } from 'react-router-dom'
import { useUserVehicles, useDeleteVehicle } from '@/config/queries/vehicles/vehicles.queries'
import { MoreVertical, Trash2 } from 'lucide-react'

const VehicleRow: React.FC<{
  brand: string
  model: string
  plate: string
  color: string
  onDelete?: () => void
  isDeleting?: boolean
}> = ({ brand, model, plate, color, onDelete, isDeleting }) => {
  const [showMenu, setShowMenu] = React.useState(false)

  return (
    <div className="flex items-center justify-between bg-[#f3f6f7] rounded-xl p-4 relative">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400">
          <svg width="18" height="12" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12h20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8L6 5H18L20 8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground">{brand} {model}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="font-semibold text-sm">{plate}</div>
                    <div className="text-sm text-muted-foreground  flex items-center justify-end">{color}</div>

        </div>
        
        {onDelete && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
              disabled={isDeleting}
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showMenu && (
              <>
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      onDelete()
                      setShowMenu(false)
                    }}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setShowMenu(false)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Vehicles() {
  const { data: vehiclesData, isLoading } = useUserVehicles()
  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle()

  const vehicles = vehiclesData?.data || []

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-4 bg-background min-h-screen">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="p-2 rounded-full bg-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Vehicles</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4 bg-background min-h-screen pb-24">
      <div className="flex items-center gap-4">
        <Link to="/profile" className="p-2 rounded-full bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">Vehicles</h1>
      </div>

      <p className="text-sm text-muted-foreground">Add your vehicle for order gas stations</p>

      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No vehicles yet</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <VehicleRow
              key={vehicle.id}
              brand={vehicle.brand}
              model={vehicle.model}
              plate={vehicle.plate_number}
              color={vehicle.color}
              onDelete={() => handleDelete(vehicle.id)}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>

      <div className="fixed left-0 right-0 bottom-6 mx-auto max-w-lg px-4">
        <Link to="/vehicles/add" className="w-full block">
          <button className="w-full bg-black text-white py-3 rounded-lg font-medium">Add Vehicle</button>
        </Link>
      </div>
    </div>
  )
}
