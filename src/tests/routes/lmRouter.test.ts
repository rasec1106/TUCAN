import express from 'express'
import request from 'supertest'
import * as lmServices from '../../services/lmService'

// Create an express app for testing
const app = express()

const mockJiraDid = {
  id: 'sample-jiraDid',
  afid: 'afid-sample',
  campaign: 'campaign-sample',
  did: 'did-sample',
  description: 'description-sample',
  ivr: 'ivr-sample',
  greeting: 'greeting-sample',
  ibSkill: 'ibSkill-sample',
  obSkill: 'obSkill-sample',
  dbhRouting: 'dbhRouting-sample',
  dbhOverflow: 'dbhOverflow-sample',
  abhRouting: 'abhRouting-sample',
  abhOverflow: 'abhOverflow-sample',
  leadType: 'leadType-sample'
}

// Mock the LM services
jest.mock('../../services/lmService', () => ({
  getV1IvrParameters: jest.fn().mockResolvedValue([{ id: 1, name: 'Sample' }]),
  getV1AdditionalIvrParameters: jest.fn().mockResolvedValue([{ id: 2, name: 'Additional Sample' }]),
  getV1AfterHoursRouting: jest.fn().mockResolvedValue([{ id: 3, name: 'After Hours Sample' }]),
  getLmAfidTfn: jest.fn((jiraDid) => Promise.resolve([{ id: 4, name: 'Afid Tfn Sample', jiraDid }])) // Mock to accept an argument
}))

// Mock the middleware
jest.mock('../../middleware/validateJiraCard', () => ({
  validateJiraCard: jest.fn((_req, _res, next) => next()) // This bypasses middleware
}))

// Define routes for testing (copy structure from actual router)
app.get('/lm/getV1IvrParameters', async (_req, res) => {
  const data = await lmServices.getV1IvrParameters()
  res.json(data)
})

app.get('/lm/getV1AdditionalIvrParameters', async (_req, res) => {
  const data = await lmServices.getV1AdditionalIvrParameters()
  res.json(data)
})

app.get('/lm/getV1AfterHoursRouting', async (_req, res) => {
  const data = await lmServices.getV1AfterHoursRouting()
  res.json(data)
})

app.get('/lm/getLmAfidTfn', async (_req, res) => {
  const data = await lmServices.getLmAfidTfn(mockJiraDid)
  res.json(data)
})

// Test suite for the LM router
describe('lmRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return V1 IVR parameters', async () => {
    const expectedResponse = [{ id: 1, name: 'Sample' }]

    const response = await request(app).get('/lm/getV1IvrParameters')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
    expect(lmServices.getV1IvrParameters).toHaveBeenCalled()
  })

  it('should return V1 Additional IVR parameters', async () => {
    const expectedResponse = [{ id: 2, name: 'Additional Sample' }]

    const response = await request(app).get('/lm/getV1AdditionalIvrParameters')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
    expect(lmServices.getV1AdditionalIvrParameters).toHaveBeenCalled()
  })

  it('should return V1 After Hours Routing', async () => {
    const expectedResponse = [{ id: 3, name: 'After Hours Sample' }]

    const response = await request(app).get('/lm/getV1AfterHoursRouting')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
    expect(lmServices.getV1AfterHoursRouting).toHaveBeenCalled()
  })

  it('should return LM Afid Tfn with jiraDid argument', async () => {
    const expectedResponse = [{ id: 4, name: 'Afid Tfn Sample', jiraDid: mockJiraDid }]

    const response = await request(app).get('/lm/getLmAfidTfn')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
    expect(lmServices.getLmAfidTfn).toHaveBeenCalledWith(mockJiraDid)
  })
})
