import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../../middleware/errorHandler'

describe('errorHandler Middleware', () => {
  const mockRequest = {} as Request
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response
  const mockNext = jest.fn() as NextFunction

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should log the error and respond with default 500 and message', () => {
    const error = new Error('Internal Server Error')
    console.error = jest.fn()

    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(console.error).toHaveBeenCalledWith(error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

  it('should use error status and message if provided', () => {
    const error = { status: 404, message: 'Not Found' }

    errorHandler(error, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Not Found' })
  })
})
