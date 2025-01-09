export const createError = (message: string, status = 500): Error => {
  // Explicitly cast `error` to type `Error & { status?: number }`
  const error = new Error(message) as Error & { status?: number }
  error.status = status
  return error
}

export const handleErrorResponse = (response: any, errorMessage: string): void => {
  const status = response?.status

  // console.log(`Response status: ${status}`) // Log actual status for debugging

  if (status !== 200 && status !== 204 && status !== 201) {
    // console.error(`Error occurred: ${errorMessage}, Status Code: ${status || 500}`)
    throw createError(errorMessage, status || 500)
  }
}

export function withErrorHandling<T>(
  fn: (...args: any[]) => Promise<T>,
  errorMessage: string | ((...args: any[]) => string)
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args)
    } catch (error: any) {
      const message = typeof errorMessage === 'function' ? errorMessage(...args) : errorMessage
      throw createError(`${message}: ${error.message}`, error.status || 500)
    }
  }
}
