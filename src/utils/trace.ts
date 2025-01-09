export function trace<T extends (...args: any[]) => any> (fn: T, fnName: string): T {
  return (async (...args: Parameters<T>) => {
    console.log(`[TRACE START] ${fnName} called with arguments:`, args)
    try {
      const result = await fn(...args)
      console.log(`[TRACE END] ${fnName} returned:`, result)
      return result
    } catch (error) {
      console.error(`[TRACE ERROR] ${fnName} threw an error:`, error)
      throw error
    }
  }) as T
}

export function traceAllMethods (obj: any, objName: string) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'function') {
      obj[key] = trace(obj[key], `${objName}.${key}`)
    }
  }
  return obj
}
