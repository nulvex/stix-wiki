import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type SdoType, type SroType, type ObservableType, sdos, sros, observables } from "./schema-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type StixObjectCategory = "SDO" | "SCO" | "SRO"

export function getStixObjectCategory(type: string): StixObjectCategory | null {
  const normalizedType = type.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
  
  if (Object.keys(sdos).some(key => normalizedType === key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''))) {
    return "SDO"
  }
  
  if (Object.keys(observables).some(key => normalizedType === key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''))) {
    return "SCO"
  }
  
  if (Object.keys(sros).some(key => normalizedType === key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''))) {
    return "SRO"
  }
  
  return null
}
