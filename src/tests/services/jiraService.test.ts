import {
  getJiraCardByNumber,
  // getJiraCardDescription,
  getJiraSubtasks,
  // handleDevTaskCreation,
  createSingleDevTask,
  updateSingleDevTask
} from '../../services/jiraService'
import { fetchWithToken, postWithToken, putWithToken } from '../../utils/fetch'
import { handleErrorResponse } from '../../utils/errorUtils'
import { JiraCard } from '../../types'

jest.mock('../../utils/fetch')
jest.mock('../../utils/errorUtils')
jest.mock('../../services/fileService')

const mockJiraCard: JiraCard = {
  expand: 'mockExpandValue',
  id: 'mockIdValue',
  self: 'mockSelfValue',
  key: 'TASK-123',
  fields: {
    description: 'Initial description',
    subtasks: [
      {
        key: 'SUB-1',
        fields: {
          summary: 'Subtask summary'
        }
      }
    ],
    project: {
      id: 1001
    }
  }
}

describe('jiraService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getJiraCardByNumber', () => {
    it('should fetch the Jira card by number', async () => {
      const mockResponse = { data: mockJiraCard };
      (fetchWithToken as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getJiraCardByNumber('JIRA-123')
      expect(result).toEqual(mockJiraCard)
      expect(fetchWithToken).toHaveBeenCalledWith(expect.any(String), expect.any(String))
      expect(handleErrorResponse).toHaveBeenCalledWith(mockResponse, expect.any(String))
    })
  })

  // describe('getJiraCardDescription', () => {
  //   it('should fetch the Jira card description by number', async () => {
  //     const mockResponse = { data: mockJiraCard.fields.description };
  //     (fetchWithToken as jest.Mock).mockResolvedValue(mockResponse)

  //     const result = await getJiraCardDescription('JIRA-123')
  //     expect(result).toBe('Initial description')
  //     expect(fetchWithToken).toHaveBeenCalledWith(expect.any(String), expect.any(String))
  //     expect(handleErrorResponse).toHaveBeenCalledWith(mockResponse, expect.any(String))
  //   })
  // })

  describe('getJiraSubtasks', () => {
    it('should fetch subtasks for the Jira card', async () => {
      const result = await getJiraSubtasks('JIRA-123')
      expect(result).toEqual([
        { key: 'SUB-1', fields: { summary: 'Subtask summary' } }
      ])
    })
  })

  // describe('handleDevTaskCreation', () => {
  //   it('should create a new dev task if it does not exist', async () => {
  //     (fetchWithToken as jest.Mock).mockResolvedValue({ data: mockJiraCard })
  //     const result = await handleDevTaskCreation(mockJiraCard, 'New description', 'New task')
  //     expect(result).toBe('New task => CREATED SUCCESSFULLY\n')
  //   })

  //   it('should update an existing dev task if it exists', async () => {
  //     (fetchWithToken as jest.Mock).mockResolvedValue({
  //       data: { ...mockJiraCard, fields: { summary: 'New task' } }
  //     })
  //     const result = await handleDevTaskCreation(mockJiraCard, 'Updated description', 'New task')
  //     expect(result).toBe('New task => UPDATED SUCCESSFULLY\n')
  //   })
  // })

  describe('createSingleDevTask', () => {
    it('should create a new dev task', async () => {
      const mockResponse = { data: { key: 'JIRA-123-1' } };
      (postWithToken as jest.Mock).mockResolvedValue(mockResponse)
      const result = await createSingleDevTask(mockJiraCard, 'Description', 'Title')
      expect(result).toEqual(mockResponse.data)
      expect(postWithToken).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(String))
    })
  })

  describe('updateSingleDevTask', () => {
    it('should update an existing dev task', async () => {
      const mockResponse = { data: { key: 'JIRA-123-1' } };
      (putWithToken as jest.Mock).mockResolvedValue(mockResponse)
      const result = await updateSingleDevTask('JIRA-123', 'Updated description')
      expect(result).toEqual(mockResponse.data)
      expect(putWithToken).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(String))
    })
  })
})
