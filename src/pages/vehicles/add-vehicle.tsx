import { Link } from 'react-router-dom'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AddVehicle() {
  return (
    <div className="max-w-lg mx-auto p-4 space-y-6 bg-background min-h-screen">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/vehicles" className="p-2 rounded-full bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h1 className="text-lg font-semibold">Add vehicle</h1>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Brand</label>
          <Select >
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chevrolet">Chevrolet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Model</label>
          <Select >
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cobalt">Cobalt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Color</label>
          <Select >
            <SelectTrigger className="w-full bg-muted">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="White">White</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Plate number</label>
          <Input  className="bg-muted" placeholder="ABXXXC" />
        </div>
      </form>

      <div className="fixed left-0 right-0 bottom-6 mx-auto max-w-lg px-4">
        <Button className="w-full" >Complete</Button>
      </div>
    </div>
  )
}