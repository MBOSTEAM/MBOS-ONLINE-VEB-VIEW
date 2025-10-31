import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const TASHKENT_TZ = 'Asia/Tashkent'

// ---------------- Helpers ----------------

// String oxirida Z yoki ±HH:mm bo‘lsa — timezone mavjud
const hasTzOffset = (input: unknown): input is string =>
  typeof input === 'string' && /(Z|[+-]\d{2}:\d{2})$/.test(input)

// "1970-01-01T03:00:00Z" kabi faqat vaqt uchun ishlatilgan legacy formatni aniqlaydi
const isLegacyUtcTimeOnly = (input: unknown): input is string =>
  typeof input === 'string' && /^1970-01-01T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z$/.test(input)

// ---------------- Core conversion ----------------

const toTz = (date: string | Date) => {
  if (!date) return dayjs.tz(new Date(), TASHKENT_TZ)

  // ✅ Agar string UTC formatda bo‘lsa
  if (hasTzOffset(date)) {
    // faqat vaqt (1970-01-01T..) formatida kelsa — bugungi kunga joylashtiramiz
    if (isLegacyUtcTimeOnly(date)) {
      const hhmm = dayjs.utc(date).format('HH:mm')
      const today = dayjs().tz(TASHKENT_TZ).format('YYYY-MM-DD')
      return dayjs.tz(`${today}T${hhmm}:00`, TASHKENT_TZ)
    }
    return dayjs.utc(date).tz(TASHKENT_TZ)
  }

  // Oddiy string (timezone yo‘q)
  return dayjs.tz(date, TASHKENT_TZ)
}

// ---------------- Public API ----------------

// UTC → Tashkent (to‘liq ISO)
export const toTashkentTime = (date: string | Date): string => {
  if (!date) return ''
  return toTz(date).format('YYYY-MM-DDTHH:mm:ssZ')
}

// Tashkent → UTC
export const fromTashkentTime = (date: string | Date): string => {
  if (!date) return ''
  const d = hasTzOffset(date)
    ? dayjs(date)
    : dayjs.tz(date, TASHKENT_TZ)
  return d.utc().format()
}

// HTML input[type=date] uchun
export const toDateInputValue = (date: string | Date): string => {
  if (!date) return ''
  return toTz(date).format('YYYY-MM-DD')
}

export const fromDateInputValue = (yyyyMmDd: string): string => {
  if (!yyyyMmDd) return ''
  return dayjs.tz(yyyyMmDd, TASHKENT_TZ).utc().format()
}

// Formatlash
export const formatTz = (date: string | Date, format: string): string => {
  if (!date) return ''
  return toTz(date).format(format)
}

// Kun boshlanishi / tugashi (Tashkent)
export const startOfDayTz = (date: string | Date): string =>
  toTz(date).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')

export const endOfDayTz = (date: string | Date): string =>
  toTz(date).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')

// "HH:mm" dan to‘liq ISO (Tashkent)
export const timeToTashkentISO = (timeStr: string, baseDateISO?: string): string => {
  if (!timeStr) return ''
  const base = baseDateISO ? toTz(baseDateISO) : dayjs().tz(TASHKENT_TZ)
  const dayPart = base.format('YYYY-MM-DD')
  const hhmm = timeStr.includes(':')
    ? timeStr.slice(0, 5)
    : `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`
  return dayjs.tz(`${dayPart}T${hhmm}:00`, TASHKENT_TZ).format('YYYY-MM-DDTHH:mm:ssZ')
}

// UI uchun faqat soat
export const displayTimeTashkent = (date: string | Date): string => {
  if (!date) return ''
  return toTz(date).format('HH:mm')
}

export default dayjs
