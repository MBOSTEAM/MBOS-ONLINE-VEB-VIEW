import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const TASHKENT_TZ = 'Asia/Tashkent'

// Convert any UTC input to timezone-aware ISO string with +05:00 offset
export const toTashkentTime = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.utc(date).tz(TASHKENT_TZ).format('YYYY-MM-DDTHH:mm:ssZ')
}

// Prepare date for backend: keep timezone offset, no localization
export const fromTashkentTime = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.tz(date, TASHKENT_TZ).utc().format() // backend UTC format
}

// Helpers for UI date inputs
export const toDateInputValue = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.utc(date).tz(TASHKENT_TZ).format('YYYY-MM-DD')
}

export const fromDateInputValue = (yyyyMmDd: string): string => {
  if (!yyyyMmDd) return ''
  return dayjs.tz(yyyyMmDd, TASHKENT_TZ).utc().format()
}

export const formatTz = (date: string | Date, format: string): string => {
  if (!date) return ''
  return dayjs.utc(date).tz(TASHKENT_TZ).format(format)
}

export const startOfDayTz = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.utc(date).tz(TASHKENT_TZ).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
}

export const endOfDayTz = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.utc(date).tz(TASHKENT_TZ).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
}

// Time-only helpers
export const timeToTashkentISO = (timeStr: string, baseDateISO?: string): string => {
  if (!timeStr) return ''
  const base = baseDateISO ? dayjs.utc(baseDateISO).tz(TASHKENT_TZ) : dayjs().tz(TASHKENT_TZ)
  const dayPart = base.format('YYYY-MM-DD')
  const hhmm = timeStr.includes(':') ? timeStr.slice(0, 5) : `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`
  return dayjs.tz(`${dayPart}T${hhmm}:00`, TASHKENT_TZ).format('YYYY-MM-DDTHH:mm:ssZ')
}

export const displayTimeTashkent = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.utc(date).tz(TASHKENT_TZ).format('HH:mm')
}

export default dayjs


