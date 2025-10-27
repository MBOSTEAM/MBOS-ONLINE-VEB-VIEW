import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useVehicleParams, useAddVehicle, useBrandsInfinite, useModelsByBrandInfinite } from '@/config/queries/vehicles/vehicles.queries'
import PaginatedSelect from './paginated-select'

export default function AddVehicle() {
  const navigate = useNavigate()
  const { data: paramsData, isLoading: isLoadingParams } = useVehicleParams()
  const { mutate: addVehicle, isPending: isAdding } = useAddVehicle()

  const [brandId, setBrandId] = useState('')
  const [brandName, setBrandName] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [year, setYear] = useState('')

  // Brands infinite query
  const { data: brandsData, fetchNextPage: fetchNextBrands, hasNextPage: hasNextBrands, isFetchingNextPage: isLoadingBrands } = useBrandsInfinite(20)

  // Models infinite query
  const { data: modelsData, fetchNextPage: fetchNextModels, hasNextPage: hasNextModels, isFetchingNextPage: isLoadingModels } = useModelsByBrandInfinite(brandId, 20)

  // Colors - use static list or from params if available
  const params = paramsData?.data

  const defaultColors = [
    'Qora', 'Oq', 'Kumush', 'Qizil', 'Ko\'k', 'Yashil', 'Sariq', 'Jigarrang', 'Binafsha', 'Pushti'
  ]

  const colors = (params?.colors || defaultColors).map(item => {
    if (typeof item === 'string') return { label: item, value: item }
    if (typeof item === 'object' && item !== null && 'name' in item) return { label: item.name, value: item.name, id: item.id }
    return { label: String(item), value: String(item) }
  })

  // Process brands data - accumulate all pages
  const allBrands = brandsData?.pages.flatMap(page => page.data) || []


  const brandsOptions = allBrands.map(item => {
    if (typeof item === 'string') return { label: item, value: item }
    if (typeof item === 'object' && item !== null && 'name' in item) return { label: item.name, value: item.id || item.name, id: item.id }
    return { label: String(item), value: String(item) }
  })


  // Process models data - accumulate all pages
  const allModels = modelsData?.pages.flatMap(page => {
    // Check if page.data is an array or an object with arrays
    if (Array.isArray(page.data)) {
      return page.data
    }
    // If it's an object, try to extract models
    if (typeof page.data === 'object' && page.data !== null) {
      // Try different possible keys
      const data = page.data as any
      if (data.models && Array.isArray(data.models)) return data.models
      if (data.brand && Array.isArray(data.brand)) return data.brand
    }
    return []
  }) || []

  const modelsOptions = allModels.map(item => {
    if (typeof item === 'string') return { label: item, value: item }
    if (typeof item === 'object' && item !== null && 'name' in item) return { label: item.name, value: item.id || item.name, id: item.id }
    return { label: String(item), value: String(item) }
  })


  const handleBrandChange = (value: string) => {
    const selected = brandsOptions.find(b => b.value === value)
    setBrandId(value)
    setBrandName(selected?.label || '')
    setModel('') // Reset model when brand changes
  }

  const handleLoadMoreBrands = () => {
    if (hasNextBrands && !isLoadingBrands) {
      fetchNextBrands()
    }
  }

  const handleLoadMoreModels = () => {
    if (hasNextModels && !isLoadingModels) {
      fetchNextModels()
    }
  }

  const handleSubmit = () => {
    if (!brandName || !plateNumber || !year) {
      alert('Brand, plate number va year maydonlarini to\'ldiring')
      return
    }

    const submitData = {
      brand: String(brandName),
      model: model ? String(model) : '', // Model ixtiyoriy, string ga o'zgartirildi
      color: color ? String(color) : '', // Color ixtiyoriy, string ga o'zgartirildi
      plate_number: String(plateNumber),
      year: parseInt(year)
    }
    
    console.log('Submitting vehicle data:', submitData)

    addVehicle(
      submitData,
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
              <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">Add vehicle</h1>
      </div>

      <form className="space-y-5">
        <PaginatedSelect
          options={brandsOptions}
          value={brandId}
          onChange={handleBrandChange}
          placeholder="Select brand"
          label="Brand"
          onLoadMore={handleLoadMoreBrands}
          hasMore={hasNextBrands || false}
          isLoading={isLoadingBrands}
        />

        <PaginatedSelect
          options={modelsOptions}
          value={model}
          onChange={setModel}
          placeholder={!brandId ? "Avval brandni tanlang" : "Select model (optional)"}
          label="Model (optional)"
          onLoadMore={handleLoadMoreModels}
          hasMore={hasNextModels || false}
          isLoading={isLoadingModels}
          disabled={!brandId}
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Color (optional)</label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select color (optional)" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((c, index) => (
                <SelectItem key={`color-${index}`} value={c.value}>
                  {c.label}
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
          disabled={isAdding || !brandName || !plateNumber || !year}
        >
          {isAdding ? 'Adding...' : 'Complete'}
        </Button>
      </div>
    </div>
  )
}