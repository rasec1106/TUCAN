// src/utils/configUtils.ts
import { createError } from './errorUtils'

export const validateUrl = (url: string | undefined, name: string): string => {
  if (!url) throw createError(`Environment variable '${name}' is not set`, 500)
  return url
}
