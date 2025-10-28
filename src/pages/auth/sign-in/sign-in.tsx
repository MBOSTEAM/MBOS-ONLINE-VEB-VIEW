import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSendOtp } from '@/config/queries/auth/auth.queries'

const SignIn = () => {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const { mutate: sendOtp, isPending } = useSendOtp()

  // Format phone number as +998XXXXXXXXX (max 9 digits after +998)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // If starts with 998, add + prefix
    if (digits.startsWith('998')) {
      const withoutCountryCode = digits.slice(3)
      // Limit to 9 digits after country code
      const limitedDigits = withoutCountryCode.slice(0, 9)
      return `+998${limitedDigits}`
    }
    
    // If starts with +998, handle it
    if (value.startsWith('+998')) {
      const withoutPrefix = digits.slice(3)
      // Limit to 9 digits after country code
      const limitedDigits = withoutPrefix.slice(0, 9)
      return `+998${limitedDigits}`
    }
    
    // If just digits, add +998 prefix
    if (digits.length > 0) {
      // Limit to 9 digits after country code
      const limitedDigits = digits.slice(0, 9)
      return `+998${limitedDigits}`
    }
    
    return '+998'
  }

  // Extract clean phone number for API
  const getCleanPhoneNumber = (formatted: string) => {
    const digits = formatted.replace(/\D/g, '')
    return digits.startsWith('998') ? `+${digits}` : `+998${digits}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const handleNext = () => {
    if (phoneNumber.trim()) {
      const cleanPhone = getCleanPhoneNumber(phoneNumber)
      sendOtp(cleanPhone, {
        onSuccess: (response) => {
          navigate('/verify-phone', { 
            state: { 
              phoneNumber: cleanPhone,
              verification_token: response.data.verification_token
            } 
          })
        },
        onError: (error) => {
          console.error('Error sending OTP:', error)
        }
      })
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
                  placeholder="+998XXXXXXXXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full bg-gray-100 border-0 text-gray-900 placeholder-gray-400 rounded-lg py-3 px-4"
                />
              </div>

              {/* Next button */}
              <Button
                onClick={handleNext}
                disabled={isPending || !phoneNumber.trim()}
                className="w-full bg-black text-white hover:bg-gray-900 rounded-lg py-3 font-semibold text-base disabled:opacity-50"
              >
                {isPending ? 'Yuborilmoqda...' : 'Keyingi'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn