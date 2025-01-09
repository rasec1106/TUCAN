import request from 'supertest'
import express from 'express'
import router from '../../routes/configurationRouter'
import * as configurationService from '../../services/configurationService'
import { validateJiraCard } from '../../middleware/validateJiraCard'

jest.mock('../../services/configurationService')
jest.mock('../../middleware/validateJiraCard')

const app = express()
app.use(express.json())
app.use('/', router)

describe('configurationRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (validateJiraCard as jest.Mock).mockImplementation((_req, _res, next) => next())
  })

  describe('POST /generateDevPlan/:jiraCard', () => {
    it('should call generateDevPlan with jiraCard parameter and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateDevPlan/TEST-123')
        .expect(200)

      expect(configurationService.generateDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateDevPlan', () => {
    it('should call generateDevPlan with jiraCard query and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateDevPlan')
        .query({ card: 'TEST-123' })
        .expect(200)

      expect(configurationService.generateDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateV1IvrConfigDevPlan/:jiraCard', () => {
    it('should call generateV1IvrConfigDevPlan with jiraCard parameter and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateV1IvrConfigDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateV1IvrConfigDevPlan/TEST-123')
        .expect(200)

      expect(configurationService.generateV1IvrConfigDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateV1IvrConfigDevPlan', () => {
    it('should call generateV1IvrConfigDevPlan with jiraCard query and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateV1IvrConfigDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateV1IvrConfigDevPlan')
        .query({ card: 'TEST-123' })
        .expect(200)

      expect(configurationService.generateV1IvrConfigDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateV2IvrConfigDevPlan/:jiraCard', () => {
    it('should call generateV2IvrConfigDevPlan with jiraCard parameter and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateV2IvrConfigDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateV2IvrConfigDevPlan/TEST-123')
        .expect(200)

      expect(configurationService.generateV2IvrConfigDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateV2IvrConfigDevPlan', () => {
    it('should call generateV2IvrConfigDevPlan with jiraCard query and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateV2IvrConfigDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateV2IvrConfigDevPlan')
        .query({ card: 'TEST-123' })
        .expect(200)

      expect(configurationService.generateV2IvrConfigDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateCuyDevPlan/:jiraCard', () => {
    it('should call generateCuyDevPlan with jiraCard parameter and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateCuyDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateCuyDevPlan/TEST-123')
        .expect(200)

      expect(configurationService.generateCuyDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateCuyDevPlan', () => {
    it('should call generateCuyDevPlan with jiraCard query and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateCuyDevPlan as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateCuyDevPlan')
        .query({ card: 'TEST-123' })
        .expect(200)

      expect(configurationService.generateCuyDevPlan).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateDevPlanByCampaign/:jiraCard', () => {
    it('should call generateDevPlanByCampaign with jiraCard parameter and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateDevPlanByCampaign as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateDevPlanByCampaign/TEST-123')
        .expect(200)

      expect(configurationService.generateDevPlanByCampaign).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateDevPlanByCampaign', () => {
    it('should call generateDevPlanByCampaign with jiraCard query and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateDevPlanByCampaign as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateDevPlanByCampaign')
        .query({ card: 'TEST-123' })
        .expect(200)

      expect(configurationService.generateDevPlanByCampaign).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('PUT /updateDevPlanByCampaign/:jiraCard', () => {
    it('should call updateDevPlanByCampaign with jiraCard and body parameters and return response', async () => {
      const mockResponse = { success: true }
      const mockBody = { data: 'update data' };
      (configurationService.updateDevPlanByCampaign as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .put('/updateDevPlanByCampaign/TEST-123')
        .send(mockBody)
        .expect(200)

      expect(configurationService.updateDevPlanByCampaign).toHaveBeenCalledWith('TEST-123', mockBody)
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('PUT /updateDevPlanByCampaign', () => {
    it('should call updateDevPlanByCampaign with jiraCard query and body parameters and return response', async () => {
      const mockResponse = { success: true }
      const mockBody = { data: 'update data' };
      (configurationService.updateDevPlanByCampaign as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .put('/updateDevPlanByCampaign')
        .query({ card: 'TEST-123' })
        .send(mockBody)
        .expect(200)

      expect(configurationService.updateDevPlanByCampaign).toHaveBeenCalledWith('TEST-123', mockBody)
      expect(response.body).toEqual(mockResponse)
    })
  })

  describe('POST /generateJiraReleaseIntructions/:jiraCard', () => {
    it('should call generateJiraReleaseIntructions with jiraCard parameter and return response', async () => {
      const mockResponse = { success: true };
      (configurationService.generateJiraReleaseIntructions as jest.Mock).mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/generateJiraReleaseIntructions/TEST-123')
        .expect(200)

      expect(configurationService.generateJiraReleaseIntructions).toHaveBeenCalledWith('TEST-123')
      expect(response.body).toEqual(mockResponse)
    })
  })
})
