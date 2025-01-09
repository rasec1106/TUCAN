import express, { Request, Response } from 'express'
import * as configurationService from '../services/configurationService'
import { validateJiraCard } from '../middleware/validateJiraCard'
import { asyncHandler } from '../utils/asyncHandler'

const router = express.Router()

router.post('/generateDevPlan/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateDevPlan(req.params.jiraCard)
  res.send(response)
}))

router.post('/generateDevPlan', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateDevPlan(req.query.card as string)
  res.send(response)
}))

router.post('/generateV1IvrConfigDevPlan/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateV1IvrConfigDevPlan(req.params.jiraCard)
  res.send(response)
}))

router.post('/generateV1IvrConfigDevPlan', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateV1IvrConfigDevPlan(req.query.card as string)
  res.send(response)
}))

router.post('/generateV2IvrConfigDevPlan/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateV2IvrConfigDevPlan(req.params.jiraCard)
  res.send(response)
}))

router.post('/generateV2IvrConfigDevPlan', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateV2IvrConfigDevPlan(req.query.card as string)
  res.send(response)
}))

router.post('/generateCuyDevPlan/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateCuyDevPlan(req.params.jiraCard)
  res.send(response)
}))

router.post('/generateCuyDevPlan', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateCuyDevPlan(req.query.card as string)
  // eslint-disable-next-line no-console
  console.log('OK')
  res.send(response)
}))

router.post('/generateDevPlanByCampaign/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateDevPlanByCampaign(req.params.jiraCard)
  res.send(response)
}))

router.post('/generateDevPlanByCampaign', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateDevPlanByCampaign(req.query.card as string)
  res.send(response)
}))

router.put('/updateDevPlanByCampaign/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.updateDevPlanByCampaign(req.params.jiraCard, req.body)
  res.send(response)
}))

router.put('/updateDevPlanByCampaign', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.updateDevPlanByCampaign(req.query.card as string, req.body)
  res.send(response)
}))

router.post('/generateJiraReleaseIntructions/:jiraCard', validateJiraCard, asyncHandler(async (req: Request, res: Response) => {
  const response = await configurationService.generateJiraReleaseIntructions(req.params.jiraCard)
  res.send(response)
}))

export default router
