import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const TASHKENT_TZ = 'Asia/Tashkent'

// Convert backend date to timezone-aware ISO string with +05:00
export const toTashkentTime = (date: string | Date): string => {
    if (!date) return ''
    return dayjs.tz(date, TASHKENT_TZ).format()
}

// Prepare date (keep timezone) for sending to backend as ISO with +05:00
export const fromTashkentTime = (date: string | Date): string => {
    if (!date) return ''
    return dayjs.tz(date, TASHKENT_TZ).format()
}

// Helper: format in TZ with a pattern, default full ISO with offset
export const formatTashkent = (date: string | Date, pattern?: string): string => {
    if (!date) return ''
    return pattern ? dayjs.tz(date, TASHKENT_TZ).format(pattern) : dayjs.tz(date, TASHKENT_TZ).format()
}

// Helper: compose date (YYYY-MM-DD) and time source (e.g., ISO with time) into a TZ ISO with offset
export const composeTashkentDateTime = (yyyyMmDd: string, timeSource: string | Date): string => {
    if (!yyyyMmDd || !timeSource) return ''
    const t = dayjs.tz(timeSource, TASHKENT_TZ)
    const hours = String(t.hour()).padStart(2, '0')
    const minutes = String(t.minute()).padStart(2, '0')
    return dayjs.tz(`${yyyyMmDd}T${hours}:${minutes}:00`, TASHKENT_TZ).format()
}

export default dayjs


