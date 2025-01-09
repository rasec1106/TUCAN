import { Request, Response, NextFunction } from 'express'
import { validateJiraCard } from '../../middleware/validateJiraCard'

describe('validateJiraCard Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      params: {},
      query: {}
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    mockNext = jest.fn()
  })

  it('should return 400 if no jiraCard is provided', () => {
    validateJiraCard(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'Error: BAD REQUEST! Please include the card number in the request'
    })
    expect(mockNext).not.toHaveBeenCalled();
  })

  it('should call next if jiraCard is provided in params', () => {
    mockRequest.params = { jiraCard: 'JIRA-123' }

    validateJiraCard(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
  })

  it('should call next if jiraCard is provided in query', () => {
    mockRequest.query = { card: 'JIRA-123' }

    validateJiraCard(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
  })
})
