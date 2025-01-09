import express, { Request, Response } from 'express'
import * as jiraServices from '../services/jiraService'
import { validateJiraCard } from '../middleware/validateJiraCard'
import { asyncHandler } from '../utils/asyncHandler'

const router = express.Router()

router.get('/getJiraCardByNumber/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraCardByNumber(req.params.jiraCard)
  res.send(response)
}))

router.get('/getJiraCardByNumber', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraCardByNumber(req.query.card as string)
  res.send(response)
}))

router.get('/getJiraCardDescription/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraCardDescription(req.params.jiraCard)
  res.send(response)
}))

router.get('/getJiraCardDescription', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraCardDescription(req.query.card as string)
  res.send(response)
}))

router.get('/getJiraSubtasks/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraSubtasks(req.params.jiraCard)
  res.send(response)
}))

router.get('/getJiraSubtasks', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraSubtasks(req.query.card as string)
  res.send(response)
}))

router.get('/getJiraCardDids/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraCardDids(req.params.jiraCard)
  res.send(response)
}))

router.get('/getJiraCardDids', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await jiraServices.getJiraCardDids(req.query.card as string)
  res.send(response)
}))

export default router
