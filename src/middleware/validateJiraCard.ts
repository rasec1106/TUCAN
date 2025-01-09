import { Request, Response, NextFunction } from 'express'

export const validateJiraCard = (req: Request, res: Response, next: NextFunction): void => {
  const card = req.params.jiraCard || req.query.card
  if (!card) {
    res.status(400).send({ message: 'Error: BAD REQUEST! Please include the card number in the request' })
  } else {
    next()
  }
}