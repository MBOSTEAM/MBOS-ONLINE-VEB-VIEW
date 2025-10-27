import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  return (
    <div className="relative mt-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search services"
        className="pl-10 bg-muted border-0 text-foreground placeholder:text-muted-foreground py-7"
      />
    </div>
  )
}
