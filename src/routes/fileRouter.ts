import express, { Request, Response } from 'express'
import * as fileService from '../services/fileService'
import { asyncHandler } from '../utils/asyncHandler'

const router = express.Router()

router.get('/getJiraTableHeaders', asyncHandler(async (_req: Request, res: Response) => {
  const response = await fileService.getJiraTableHeaders()
  res.send(response)
}))

router.get('/getJiraTableContentMapping', asyncHandler(async (_req: Request, res: Response) => {
  const response = await fileService.getJiraTableContentMapping()
  res.send(response)
}))

router.get('/getLmIvr', asyncHandler(async (_req: Request, res: Response) => {
  const response = await fileService.getLmIvr()
  res.send(response)
}))

router.get('/getLmLeadTypeUrl', asyncHandler(async (_req: Request, res: Response) => {
  const response = await fileService.getLmLeadTypeUrl()
  res.send(response)
}))

router.get('/getLmObSubcampaignUrl', asyncHandler(async (_req: Request, res: Response) => {
  const response = await fileService.getLmObSubcampaignUrl()
  res.send(response)
}))

export default router
