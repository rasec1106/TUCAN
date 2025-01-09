import express, { Request, Response } from 'express'
import * as lmService from '../services/lmService'
import { asyncHandler } from '../utils/asyncHandler'

const router = express.Router()

router.get('/getV1IvrParameters', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV1IvrParameters()
  res.send(response)
}))

router.get('/getV1AdditionalIvrParameters', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV1AdditionalIvrParameters()
  res.send(response)
}))

router.get('/getV1AfterHoursRouting', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV1AfterHoursRouting()
  res.send(response)
}))

router.get('/getV1AgentUnavailableParameters', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV1AgentUnavailableParameters()
  res.send(response)
}))

router.get('/getV1AgentUnavailableRouting', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV1AgentUnavailableRouting()
  res.send(response)
}))

router.get('/getV1RoutingOptionsByTfn', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV1RoutingOptionsByTfn()
  res.send(response)
}))

router.get('/getV2DidsFromIvrConfig', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV2DidsFromIvrConfig()
  res.send(response)
}))

router.get('/getV2DidRoutingFromIvrConfig', asyncHandler(async (_req: Request, res: Response) => {
  const response = await lmService.getV2DidRoutingFromIvrConfig()
  res.send(response)
}))

// POST routes with asyncHandler
router.post('/getLmAfidTfn', asyncHandler(async (req: Request, res: Response) => {
  const response = await lmService.getLmAfidTfn(req.body)
  res.send(response)
}))

router.post('/getLmLeadType', asyncHandler(async (req: Request, res: Response) => {
  const response = await lmService.getLmLeadType(req.body.did, req.body.leadtypeUrl)
  res.send(response)
}))

router.post('/getLmObSkill', asyncHandler(async (req: Request, res: Response) => {
  const response = await lmService.getLmObSubcampaign(req.body.did, req.body.obSubcampaignUrl)
  res.send(response)
}))

export default router
