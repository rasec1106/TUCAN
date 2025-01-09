import express, { Request, Response } from 'express'
import * as validatorService from '../services/validatorService'
import { validateJiraCard } from '../middleware/validateJiraCard'
import { asyncHandler } from '../utils/asyncHandler'

const router = express.Router()

// Compare DIDs with Jira card from params
router.get('/compareDids/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await validatorService.compareDids(req.params.jiraCard)
  res.send(response)
}))

// Compare DIDs with Jira card from query
router.get('/compareDids', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await validatorService.compareDids(req.query.card as string)
  res.send(response)
}))

export default router
