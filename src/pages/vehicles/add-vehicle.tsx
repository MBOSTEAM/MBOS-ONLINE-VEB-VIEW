import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useVehicleParams, useAddVehicle } from '@/config/queries/vehicles/vehicles.queries'

export default function AddVehicle() {
  const navigate = useNavigate()
  const { data: paramsData, isLoading: isLoadingParams } = useVehicleParams()
  const { mutate: addVehicle, isPending: isAdding } = useAddVehicle()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [year, setYear] = useState('')

  const params = paramsData?.data
  
  // API may return objects with {id, name} or just strings
  const brands = (params?.brands || []).map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null && 'name' in item) return item.name
    return String(item)
  })
  const models = (params?.models || []).map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null && 'name' in item) return item.name
    return String(item)
  })
  const colors = (params?.colors || []).map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null && 'name' in item) return item.name
    return String(item)
  })
  
  // Debug API response
  if (paramsData && brands.length === 0) {
    console.log('Vehicle params API response:', paramsData)
  }

  const handleSubmit = () => {
    if (!brand || !model || !color || !plateNumber || !year) {
      alert('Barcha maydonlarni to\'ldiring')
      return
    }

    addVehicle(
      {
        brand,
        model,
        color,
        plate_number: plateNumber,
        year: parseInt(year)
      },
      {
        onSuccess: () => {
          navigate('/vehicles')
        },
        onError: (error: any) => {
          console.error('Error adding vehicle:', error)
        }
      }
    )
  }

  if (isLoadingParams) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-6 bg-background min-h-screen">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/vehicles" className="p-2 rounded-full bg-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Add vehicle</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6 bg-background min-h-screen pb-24">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/vehicles" className="p-2 rounded-full bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">Add vehicle</h1>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Brand</label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b, index) => (
                <SelectItem key={`brand-${index}`} value={String(b)}>
                  {String(b)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Model</label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m, index) => (
                <SelectItem key={`model-${index}`} value={String(m)}>
                  {String(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Color</label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((c, index) => (
                <SelectItem key={`color-${index}`} value={String(c)}>
                  {String(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Plate number</label>
          <Input 
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            className="bg-muted" 
            placeholder="ABXXXC" 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Year</label>
          <Input 
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-muted" 
            placeholder="2022" 
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>
      </form>

      <div className="fixed left-0 right-0 bottom-6 mx-auto max-w-lg px-4">
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isAdding || !brand || !model || !color || !plateNumber || !year}
        >
          {isAdding ? 'Adding...' : 'Complete'}
        </Button>
      </div>
    </div>
  )
}