import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginatedSelectProps {
  options: Array<{ label: string; value: string; id?: string }>
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  disabled?: boolean
}

export default function PaginatedSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  disabled = false,
}: PaginatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const handleScroll = useCallback(() => {
    if (!listRef.current || !onLoadMore || !hasMore || isLoading) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      onLoadMore()
    }
  }, [onLoadMore, hasMore, isLoading])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm",
            "flex items-center justify-between",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="overflow-y-auto max-h-60 scrollbar-thin"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors",
                    value === option.value && "bg-accent"
                  )}
                >
                  {option.label}
                </button>
              ))}
              
              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              
              {!hasMore && options.length > 0 && (
                <div className="text-center py-2 text-xs text-muted-foreground">
                  Barcha ma'lumotlar yuklandi
                </div>
              )}
              
              {options.length === 0 && !isLoading && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  {disabled ? 'Avval brandni tanlang' : 'Ma\'lumot topilmadi'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

