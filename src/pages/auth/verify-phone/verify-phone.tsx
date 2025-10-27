import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const VerifyPhone = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const phoneNumber = location.state?.phoneNumber || ''

	const [otp, setOtp] = useState(['', '', '', '', '', ''])
	const [timeLeft, setTimeLeft] = useState(58)
	const [canResend, setCanResend] = useState(false)

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		} else {
			setCanResend(true)
		}
	}, [timeLeft])

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) return // Only allow single digit

		const newOtp = [...otp]
		newOtp[index] = value
		setOtp(newOtp)

		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`)
			nextInput?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`)
			prevInput?.focus()
		}
	}

	const handleSubmit = () => {
		const otpCode = otp.join('')
		if (otpCode.length === 6) {
			// Handle OTP verification logic here
			console.log('OTP submitted:', otpCode)
			// Navigate to setup profile
			navigate('/setup-profile')
		}
	}

	const handleResend = () => {
		setTimeLeft(58)
		setCanResend(false)
		// Handle resend logic here
		console.log('Resending OTP to:', phoneNumber)
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<main className='h-full overflow-hidden'>
			{/* Logo/Branding */}
			<div className=" flex items-center justify-center gap-2">
				<div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">MBOS</div>
				<span className="text-gray-900 font-medium">Online</span>
			</div>
			<div className='flex flex-col items-center justify-center flex-auto h-full'>
				<div className='flex flex-col items-center gap-y-6 max-w-md mx-auto px-4'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-2'>Verify phone number</h1>
						<p className='text-lg text-gray-600 mb-4'>
							Enter 6 digit code from SMS code sent to {phoneNumber}
						</p>
					</div>

					<div className='flex gap-2'>
						{otp.map((digit, index) => (
							<Input
								key={index}
								id={`otp-${index}`}
								type='text'
								inputMode='numeric'
								pattern='[0-9]*'
								maxLength={1}
								value={digit}
								onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-lg font-bold'
							/>
						))}
					</div>

					<Button
						onClick={handleSubmit}
						disabled={otp.some(digit => !digit)}
						className='w-full bg-black text-white hover:bg-gray-900'
					>
						Verify
					</Button>

					<div className='text-center'>
						{canResend ? (
							<Button variant='link' onClick={handleResend} className='text-sm'>
								Resend code
							</Button>
						) : (
							<p className='text-sm text-gray-500'>
								Resend code after {formatTime(timeLeft)}
							</p>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}

export default VerifyPhone