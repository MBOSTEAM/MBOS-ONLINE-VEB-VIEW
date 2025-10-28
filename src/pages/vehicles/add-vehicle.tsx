import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useVehicleParams, useAddVehicle, useBrandsInfinite, useModelsByBrandInfinite } from '@/config/queries/vehicles/vehicles.queries'

export default function AddVehicle() {
  const navigate = useNavigate()
  const { data: paramsData, isLoading: isLoadingParams } = useVehicleParams()
  const { mutate: addVehicle, isPending: isAdding } = useAddVehicle()

  const [brandId, setBrandId] = useState('')
  const [brandName, setBrandName] = useState('')
  const [model, setModel] = useState('')
  const [modelName, setModelName] = useState('')
  const [color, setColor] = useState('')
  const [colorName, setColorName] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [year, setYear] = useState('')

  // Search filters
  const [brandSearch, setBrandSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  const [colorSearch, setColorSearch] = useState('')

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


  // Filter functions
  const filteredBrands = brandsOptions.filter(brand => 
    brand.label.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const filteredModels = modelsOptions.filter(model => 
    model.label.toLowerCase().includes(modelSearch.toLowerCase())
  )

  const filteredColors = colors.filter(color => 
    color.label.toLowerCase().includes(colorSearch.toLowerCase())
  )

  const handleBrandChange = (value: string) => {
    const selected = brandsOptions.find(b => b.value === value)
    setBrandId(value)
    setBrandName(selected?.label ?? selected?.value ?? value)
    setModel('') // Reset model when brand changes
    setModelName('')
  }

  const handleModelChange = (value: string) => {
    const selected = modelsOptions.find(m => m.value === value)
    setModel(value)
    setModelName(selected?.label ?? selected?.value ?? value)
    setColor('')
    setColorName('')
  }

  const handleColorChange = (value: string) => {
    const selected = colors.find(c => c.value === value)
    setColor(value)
    setColorName(selected?.label ?? selected?.value ?? value)
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
    // Debug log to see all values
    console.log('Form values:', {
      brandName,
      model,
      color,
      plateNumber,
      year,
    })

    if (!brandName || !model || !color || !plateNumber || !year) {
      alert('Barcha maydonlarni to\'ldiring')
      console.log('Missing fields:', {
        brandName: !brandName,
        model: !model,
        color: !color,
        plateNumber: !plateNumber,
        year: !year
      })
      return
    }

    const submitData = {
      brand: String(brandName),
      model: String(model),
      color: String(color),
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

      {/* Selected Values Summary */}
      <div className="space-y-2 mb-6">
        {brandName && (
          <div className="p-3 rounded-lg bg-primary/5 flex items-center justify-between">
            <span className="text-sm font-medium">Brand: {brandName}</span>
            <Button variant="ghost" size="sm" onClick={() => setBrandId('')} className="h-8 w-8 p-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        )}
        {modelName && (
          <div className="p-3 rounded-lg bg-primary/5 flex items-center justify-between">
            <span className="text-sm font-medium">Model: {modelName}</span>
            <Button variant="ghost" size="sm" onClick={() => setModel('')} className="h-8 w-8 p-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        )}
        {colorName && (
          <div className="p-3 rounded-lg bg-primary/5 flex items-center justify-between">
            <span className="text-sm font-medium">Color: {colorName}</span>
            <Button variant="ghost" size="sm" onClick={() => setColor('')} className="h-8 w-8 p-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Brand Selection */}
        {!brandId && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Select Brand</h2>
            <Input
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Search brands..."
              className="mb-4"
            />
            <div className="grid grid-cols-1 gap-4">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.value}
                  onClick={() => handleBrandChange(brand.value)}
                  className={`p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors
                    flex items-center justify-center text-center min-h-[100px]
                    ${brandId === brand.value ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                >
                  {brand.label}
                </div>
              ))}
            </div>
            {hasNextBrands && !isLoadingBrands && (
              <Button
                variant="outline"
                onClick={handleLoadMoreBrands}
                className="w-full"
              >
                Load More Brands
              </Button>
            )}
          </div>
        )}

        {/* Model Selection */}
        {brandId && !model && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setBrandId('')} className="p-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <h2 className="text-lg font-medium">Select Model for {brandName}</h2>
            </div>
            <Input
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Search models..."
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              {filteredModels.map((modelOption) => (
                <div
                  key={modelOption.value}
                  onClick={() => handleModelChange(modelOption.value)}
                  className={`p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors
                    flex items-center justify-center text-center min-h-[100px]
                    ${model === modelOption.value ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                >
                  {modelOption.label}
                </div>
              ))}
            </div>
            {hasNextModels && !isLoadingModels && (
              <Button
                variant="outline"
                onClick={handleLoadMoreModels}
                className="w-full"
              >
                Load More Models
              </Button>
            )}
          </div>
        )}

        {/* Color Selection */}
        {model && !color && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setModel('')} className="p-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <h2 className="text-lg font-medium">Select Color</h2>
            </div>
            <Input
              value={colorSearch}
              onChange={(e) => setColorSearch(e.target.value)}
              placeholder="Search colors..."
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              {filteredColors.map((c) => (
                <div
                  key={c.value}
                  onClick={() => handleColorChange(c.value)}
                  className={`p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors
                    flex items-center justify-center text-center 
                    ${color === c.value ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Details */}
        {color && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setColor('')} className="p-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <h2 className="text-lg font-medium">Vehicle Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">Plate number *</label>
                <Input
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="bg-muted"
                  placeholder="ABXXXC"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">Year *</label>
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
            </div>
          </div>
        )}
      </div>

      <div className="fixed left-0 right-0 bottom-6 mx-auto max-w-lg px-4">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isAdding || !brandName || !model || !color || !plateNumber || !year}
        >
          {isAdding ? 'Adding...' : 'Complete'}
        </Button>
      </div>
    </div>
  )
}