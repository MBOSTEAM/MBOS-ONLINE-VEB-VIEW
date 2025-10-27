import React, { createContext, useContext, useState } from "react"

type TabsContextType = {
  value: string
  onChange: (v: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function Tabs({ defaultValue, value, onValueChange, children }: {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
}) {
  const [internal, setInternal] = useState<string>(defaultValue ?? "")
  const current = value ?? internal
  function handleChange(v: string) {
    onValueChange?.(v)
    setInternal(v)
  }

  return (
    <TabsContext.Provider value={{ value: current, onChange: handleChange }}>
      {children}
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  const active = ctx.value === value
  const base = "px-4 py-2 rounded-full text-sm"
  const activeCls = "bg-foreground text-background font-medium"
  const inactiveCls = "bg-muted text-muted-foreground"

  return (
    <button
      type="button"
      onClick={() => ctx.onChange(value)}
      className={`${base} ${active ? activeCls : inactiveCls} ${className}`}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) => {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  return ctx.value === value ? <div className={className}>{children}</div> : null
}

export default Tabs
