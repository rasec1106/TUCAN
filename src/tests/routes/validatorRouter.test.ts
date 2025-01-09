// src/tests/routes/validatorRouter.test.ts
import express from 'express'
import request from 'supertest'
import validatorRouter from '../../routes/validatorRouter'
import * as validatorService from '../../services/validatorService'

// Initialize an express app and use the router
const app = express()
app.use('/validator', validatorRouter)

// Mock the validatorService
jest.mock('../../services/validatorService', () => ({
  compareDids: jest.fn((jiraCard) => Promise.resolve({ message: `Compared DIDs for ${jiraCard}` }))
}))

// Mock the validateJiraCard middleware
jest.mock('../../middleware/validateJiraCard', () => ({
  validateJiraCard: jest.fn((_req, _res, next) => next()) // Bypass middleware validation
}))

describe('validatorRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should compare DIDs with Jira card from params', async () => {
    const jiraCard = 'sampleJiraCard'
    const expectedResponse = { message: `Compared DIDs for ${jiraCard}` }

    const response = await request(app).get(`/validator/compareDids/${jiraCard}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
    expect(validatorService.compareDids).toHaveBeenCalledWith(jiraCard)
  })

  it('should compare DIDs with Jira card from query', async () => {
    const jiraCard = 'sampleJiraCard'
    const expectedResponse = { message: `Compared DIDs for ${jiraCard}` }

    const response = await request(app).get('/validator/compareDids').query({ card: jiraCard })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
    expect(validatorService.compareDids).toHaveBeenCalledWith(jiraCard)
  })
})
