import { createError, handleErrorResponse, withErrorHandling } from '../../utils/errorUtils'

describe('errorUtils', () => {
  describe('createError', () => {
    it('should create an error with a custom message and status', () => {
      const error = createError('Not Found', 404)
      expect(error.message).toBe('Not Found')
      expect((error as any).status).toBe(404)
    })

    it('should default to status 500 if none is provided', () => {
      const error = createError('Server Error')
      expect((error as any).status).toBe(500)
    })
  })

  describe('handleErrorResponse', () => {
    it('should throw an error if response is not 200', () => {
      const response = { status: 500 }
      expect(() => handleErrorResponse(response, 'Failed')).toThrowError('Failed')
    })

    it('should not throw if response status is 200', () => {
      const response = { status: 200 }
      expect(() => handleErrorResponse(response, 'Failed')).not.toThrow()
    })
  })

  describe('withErrorHandling', () => {
    it('should return the result if no error is thrown', async () => {
      const fn = jest.fn().mockResolvedValue('Success')
      const wrappedFn = withErrorHandling(fn, 'Error occurred')
      await expect(wrappedFn()).resolves.toBe('Success')
    })

    it('should throw a custom error message if function fails', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Internal Error'))
      const wrappedFn = withErrorHandling(fn, 'Operation failed')
      await expect(wrappedFn()).rejects.toThrowError('Operation failed: Internal Error')
    })
  })
})
