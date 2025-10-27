"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

export default function SetupProfilePage() {
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (name.trim()) {
      console.log("Profile name:", name)
    }
  }

  return (
    <div>
      {/* Logo/Branding */}
      <div className="mb-12 flex items-center justify-center gap-2">
        <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
        <span className="text-gray-900 font-medium">Online</span>
      </div>
      <div className="h-full mt-10 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm mt-50">
          {/* Content */}
          <div className="flex flex-col items-center justify-center">
          {/* Setup profile heading */}
          <h1 className="text-3xl font-bold text-black mb-8 text-center">Setup profile</h1>

          {/* Avatar section */}
          <div className="mb-8 relative">
            <button onClick={handleAvatarClick} className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar || undefined} alt="Profile" />
                <AvatarFallback className="bg-purple-200">
                  <svg className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </AvatarFallback>
              </Avatar>
              {/* Camera icon */}
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md">
                <Camera className="w-4 h-4 text-gray-900" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Name input section */}
          <div className="w-full">
            <label className="block text-sm font-medium text-black mb-2">Your name</label>
            <Input
              type="text"
              placeholder="Ex: Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 border-0 text-gray-900 placeholder-gray-400 rounded-lg py-3 px-4 mb-6"
            />

            {/* Next button */}
            <Button
              onClick={handleNext}
              className="w-full bg-black text-white hover:bg-gray-900 rounded-lg py-3 font-semibold text-base"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}