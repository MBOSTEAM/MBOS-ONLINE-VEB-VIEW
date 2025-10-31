import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const TASHKENT_TZ = 'Asia/Tashkent'

// UTC → Tashkent (to‘liq ISO, +05:00)
export const toTashkentTime = (date: string | Date): string => {
  if (!date) return ''
  return dayjs(date).tz(TASHKENT_TZ).format('YYYY-MM-DDTHH:mm:ssZ')
}

// Tashkent → UTC (backendga yuborish uchun)
export const fromTashkentTime = (date: string | Date): string => {
  if (!date) return ''
  return dayjs.tz(date, TASHKENT_TZ).utc().format()
}

// input[type=date] uchun
export const toDateInputValue = (date: string | Date): string => {
  if (!date) return ''
  return dayjs(date).tz(TASHKENT_TZ).format('YYYY-MM-DD')
}

export const fromDateInputValue = (yyyyMmDd: string): string => {
  if (!yyyyMmDd) return ''
  return dayjs.tz(yyyyMmDd, TASHKENT_TZ).utc().format()
}

// Formatlash
export const formatTz = (date: string | Date, format: string): string => {
  if (!date) return ''
  return dayjs(date).tz(TASHKENT_TZ).format(format)
}

// Kun boshlanishi / tugashi
export const startOfDayTz = (date: string | Date): string =>
  dayjs(date).tz(TASHKENT_TZ).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')

export const endOfDayTz = (date: string | Date): string =>
  dayjs(date).tz(TASHKENT_TZ).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')

// "HH:mm" dan to‘liq ISO (Tashkent)
export const timeToTashkentISO = (timeStr: string, baseDateISO?: string): string => {
  if (!timeStr) return ''
  const base = baseDateISO
    ? dayjs(baseDateISO).tz(TASHKENT_TZ)
    : dayjs().tz(TASHKENT_TZ)
  const dayPart = base.format('YYYY-MM-DD')
  const hhmm = timeStr.includes(':')
    ? timeStr.slice(0, 5)
    : `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`
  return dayjs.tz(`${dayPart}T${hhmm}:00`, TASHKENT_TZ).format('YYYY-MM-DDTHH:mm:ssZ')
}

// UI uchun faqat soat
export const displayTimeTashkent = (date: string | Date): string => {
  if (!date) return ''
  return dayjs(date).tz(TASHKENT_TZ).format('HH:mm')
}

export default dayjs
