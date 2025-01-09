import express from 'express'
import request from 'supertest'
import * as jiraServices from '../../services/jiraService'

// Create an express app for testing
const app = express()

// Define a simple mock router
const router = express.Router()

// Mock the Jira services
jest.mock('../../services/jiraService', () => ({
  getJiraCardByNumber: jest.fn(),
  getJiraCardDescription: jest.fn().mockResolvedValue('This is the description of the Jira card'),
  getJiraSubtasks: jest.fn().mockResolvedValue([{ key: 'JIRA-124', summary: 'Subtask 1', fields: { summary: 'Subtask summary' } }]),
  getJiraCardDids: jest.fn().mockResolvedValue([{
    did: '1234567890',
    afid: 'AFID001',
    campaign: 'Campaign 1',
    ivr: 'IVR001',
    description: 'Description',
    greeting: 'Hello',
    ibSkill: 'Skill1',
    obSkill: 'Skill2',
    dbhRouting: 'Route1',
    ivrMenu: 'Menu1',
    language: 'English',
    priority: 'High',
    dbhOverflow: 'Overflow1',
    abhRouting: 'Routing1',
    abhOverflow: 'Overflow2',
    leadType: 'LeadType1'
  }])
}))

//TODO: To mock this to avoid duplicated code
// Mock the middleware to bypass validation
jest.mock('../../middleware/validateJiraCard', () => ({
  validateJiraCard: jest.fn((_req, _res, next) => next()) // This bypasses middleware
}))

// Route definitions (same as your actual router)
router.get('/getJiraCardDescription/:jiraCard', async (req, res) => {
  const description = await jiraServices.getJiraCardDescription(req.params.jiraCard)
  res.json(description)
})

router.get('/getJiraCardDescription', async (req, res) => {
  const description = await jiraServices.getJiraCardDescription(req.query.card as string)
  res.json(description)
})

router.get('/getJiraCardByNumber/:jiraCard', async (req, res) => {
  const card = await jiraServices.getJiraCardByNumber(req.params.jiraCard)
  res.json(card)
})

router.get('/getJiraCardSubtasks/:jiraCard', async (req, res) => {
  const subtasks = await jiraServices.getJiraSubtasks(req.params.jiraCard)
  res.json(subtasks)
})

router.get('/getJiraCardDids/:jiraCard', async (req, res) => {
  const dids = await jiraServices.getJiraCardDids(req.params.jiraCard)
  res.json(dids)
})

app.use('/jira', router)

// Test suite for the Jira router
describe('jiraRouter', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should return Jira card description from URL param', async () => {
    const mockDescription = 'This is the description of the Jira card'

    const response = await request(app).get('/jira/getJiraCardDescription/JIRA-123')

    // Assertions
    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockDescription)
    expect(jiraServices.getJiraCardDescription).toHaveBeenCalledWith('JIRA-123')
  })

  it('should return Jira card description from query param', async () => {
    const mockDescription = 'This is the description of the Jira card'

    const response = await request(app).get('/jira/getJiraCardDescription?card=JIRA-123')

    // Assertions
    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockDescription)
    expect(jiraServices.getJiraCardDescription).toHaveBeenCalledWith('JIRA-123')
  })

  it('should return Jira card by number from URL param', async () => {
    const mockCard = {
      key: 'JIRA-123',
      id: '123',
      self: 'https://jira.example.com/rest/api/2/issue/JIRA-123',
      expand: '',
      fields: {
        summary: 'Test Card',
        description: 'This is a test card description.',
        issuetype: { name: 'Bug' },
        project: { key: 'TEST', id: 123 }, // Fixed: project should include an 'id' field with a number
        subtasks: [{
          key: 'JIRA-124',
          summary: 'Subtask 1',
          fields: { summary: 'Subtask 1 description' }
        }]
      }
    }

    jest.spyOn(jiraServices, 'getJiraCardByNumber').mockResolvedValue(mockCard)

    const response = await request(app).get('/jira/getJiraCardByNumber/JIRA-123')

    // Assertions
    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockCard) // Ensure it returns the correct card
    expect(jiraServices.getJiraCardByNumber).toHaveBeenCalledWith('JIRA-123')
  })

  it('should return Jira card subtasks from URL param', async () => {
    const mockSubtasks = [{
      key: 'JIRA-124',
      summary: 'Subtask 1',
      fields: { summary: 'Subtask summary' } // Include summary inside fields
    }]

    jest.spyOn(jiraServices, 'getJiraSubtasks').mockResolvedValue(mockSubtasks)

    const response = await request(app).get('/jira/getJiraCardSubtasks/JIRA-123')

    // Assertions
    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockSubtasks) // Ensure it returns the correct subtasks
    expect(jiraServices.getJiraSubtasks).toHaveBeenCalledWith('JIRA-123')
  })

  it('should return Jira card DIDs from URL param', async () => {
    const mockDids = [{
      did: '1234567890',
      afid: 'AFID001',
      campaign: 'Campaign 1',
      ivr: 'IVR001',
      description: 'Description',
      greeting: 'Hello',
      ibSkill: 'Skill1',
      obSkill: 'Skill2',
      dbhRouting: 'Route1',
      ivrMenu: 'Menu1',
      language: 'English',
      priority: 'High',
      dbhOverflow: 'Overflow1', // Added missing fields
      abhRouting: 'Routing1',
      abhOverflow: 'Overflow2',
      leadType: 'LeadType1'
    }]

    jest.spyOn(jiraServices, 'getJiraCardDids').mockResolvedValue(mockDids)

    const response = await request(app).get('/jira/getJiraCardDids/JIRA-123')

    // Assertions
    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockDids) // Ensure it returns the correct DIDs
    expect(jiraServices.getJiraCardDids).toHaveBeenCalledWith('JIRA-123')
  })
})