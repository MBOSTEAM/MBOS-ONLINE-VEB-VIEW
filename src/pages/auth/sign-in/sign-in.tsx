import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleNext = () => {
    if (phoneNumber.trim()) {
      navigate('/verify-phone', { state: { phoneNumber } })
    }
  }
  return (
    <div>
        {/* Logo/Branding */}
      <div className="mb-12 flex items-center justify-center gap-2">
        <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
        <span className="text-gray-900 font-medium">Online</span>
      </div>
      <div className="h-full mt-50 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Content */}
          <div className="flex flex-col items-center justify-center">
          


            {/* Welcome heading */}
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Welcome</h1>

            {/* Sign in section */}
            <div className="w-full">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center justify-center mt-5">Sign in</h2>

              {/* Phone number input */}
              <div className="mb-6">
                <label className="block text-xl font-medium text-black mb-2">Phone number</label>
                <Input
                  type="tel"
                  placeholder="+998"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-gray-100 border-0 text-gray-900 placeholder-gray-400 rounded-lg py-3 px-4"
                />
              </div>

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

export default SignIn