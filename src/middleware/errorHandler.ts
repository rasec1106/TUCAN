import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(error)  // Log error for debugging
  res.status(error.status || 500).send({ message: error.message || 'Internal Server Error' })
}