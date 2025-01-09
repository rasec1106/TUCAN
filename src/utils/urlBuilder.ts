// src/utils/urlBuilder.ts
export const buildUrl = (template: string, replacements: Record<string, string>): string => {
  let url = template
  for (const [key, value] of Object.entries(replacements)) {
    url = url.replace(`{${key}}`, value)
  }
  return url
}
