export const log = (log: any) => console.log(log)
export const logError = (error: any) => console.error(error)
export const logWarning = (warning: any) => console.warn(warning)
export const isClient = typeof window !== 'undefined'
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
const toString = Object.prototype.toString
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
export const isNumber = (val: any): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isObject = (val: any): val is object => toString.call(val) === '[object Object]'
export const isWindow = (val: any): val is Window =>
  typeof window !== 'undefined' && toString.call(val) === '[object Window]'
export const now = () => Date.now()
export const timestamp = () => +Date.now()
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
export const noop = () => {}
export const rand = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export const isArray = (data: any) => Array.isArray(data)

export const isObjectItemNull = (data: any) => {
  if (data === null) return 1
  let num = 0
  Object.values(data).forEach((item) => {
    if (item === undefined || item === null || item === '') {
      num += 1
    }
    if (isObject(item)) {
      num += isObjectItemNull(item)
    }
  })
  return num
}
