import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'

describe('asyncHandler', () => {
  it('should call next with error if the function throws', async () => {
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    const error = new Error('Async Error')
    const failingAsyncFunction = async () => { throw error }

    await asyncHandler(failingAsyncFunction)(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('should call the wrapped function if no error is thrown', async () => {
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn()

    const successAsyncFunction = async () => { return; }

    await asyncHandler(successAsyncFunction)(req, res, next)

    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })
})
