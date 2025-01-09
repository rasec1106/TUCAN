import { trace, traceAllMethods } from '../../utils/trace'

describe('trace utility functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn()
    console.error = jest.fn()
  })

  describe('trace function', () => {
    const mockFn = jest.fn().mockResolvedValue('mockResult')
    const tracedFn = trace(mockFn, 'mockFn')

    it('logs start, end, and return value correctly', async () => {
      const result = await tracedFn('arg1', 'arg2')

      expect(result).toBe('mockResult')
      expect(console.log).toHaveBeenCalledWith('[TRACE START] mockFn called with arguments:', ['arg1', 'arg2'])
      expect(console.log).toHaveBeenCalledWith('[TRACE END] mockFn returned:', 'mockResult')
    })

    it('logs error if function throws', async () => {
      const errorFn = jest.fn().mockRejectedValue(new Error('Test Error'))
      const tracedErrorFn = trace(errorFn, 'errorFn')

      await expect(tracedErrorFn()).rejects.toThrow('Test Error')
      expect(console.log).toHaveBeenCalledWith('[TRACE START] errorFn called with arguments:', [])
      expect(console.error).toHaveBeenCalledWith('[TRACE ERROR] errorFn threw an error:', new Error('Test Error'))
    })
  })

  describe('traceAllMethods function', () => {
    it('wraps all methods of an object with trace', async () => {
      const mockObj = {
        method1: jest.fn().mockResolvedValue('result1'),
        method2: jest.fn().mockResolvedValue('result2')
      }

      const tracedObj = traceAllMethods(mockObj, 'mockObj')

      await tracedObj.method1()
      await tracedObj.method2()

      expect(console.log).toHaveBeenCalledWith('[TRACE START] mockObj.method1 called with arguments:', [])
      expect(console.log).toHaveBeenCalledWith('[TRACE END] mockObj.method1 returned:', 'result1')
      expect(console.log).toHaveBeenCalledWith('[TRACE START] mockObj.method2 called with arguments:', [])
      expect(console.log).toHaveBeenCalledWith('[TRACE END] mockObj.method2 returned:', 'result2')
    })
  })
})
