import request from 'supertest'
import express from 'express'
import fileRouter from '../../routes/fileRouter' // Import the fileRouter
import * as fileService from '../../services/fileService'

const app = express()
app.use('/api/files', fileRouter)

jest.mock('../../services/fileService')

describe('fileRouter', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return Jira table headers', async () => {
    // Mock the response from the service
    (fileService.getJiraTableHeaders as jest.Mock).mockResolvedValue({ headers: ['header1', 'header2'] })

    const response = await request(app).get('/api/files/getJiraTableHeaders')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ headers: ['header1', 'header2'] })
    expect(fileService.getJiraTableHeaders).toHaveBeenCalled()
  })

  it('should return Jira table content mapping', async () => {
    (fileService.getJiraTableContentMapping as jest.Mock).mockResolvedValue({ content: 'mapping' })

    const response = await request(app).get('/api/files/getJiraTableContentMapping')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ content: 'mapping' })
    expect(fileService.getJiraTableContentMapping).toHaveBeenCalled()
  })

  it('should return LM IVR', async () => {
    (fileService.getLmIvr as jest.Mock).mockResolvedValue({ ivr: 'ivrData' })

    const response = await request(app).get('/api/files/getLmIvr')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ivr: 'ivrData' })
    expect(fileService.getLmIvr).toHaveBeenCalled()
  })

  it('should return LM Lead Type URL', async () => {
    (fileService.getLmLeadTypeUrl as jest.Mock).mockResolvedValue({ url: 'http://example.com' })

    const response = await request(app).get('/api/files/getLmLeadTypeUrl')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ url: 'http://example.com' })
    expect(fileService.getLmLeadTypeUrl).toHaveBeenCalled()
  })

  it('should return LM OB Subcampaign URL', async () => {
    (fileService.getLmObSubcampaignUrl as jest.Mock).mockResolvedValue({ url: 'http://example.com/ob' })

    const response = await request(app).get('/api/files/getLmObSubcampaignUrl')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ url: 'http://example.com/ob' })
    expect(fileService.getLmObSubcampaignUrl).toHaveBeenCalled()
  })
})
