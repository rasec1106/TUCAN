// import { trace } from 'trace'
import { JiraDid, JiraCard, JiraHeader, JiraContentMapping, JiraSubtask } from '../types'
import { fetchWithToken, postWithToken, putWithToken } from '../utils/fetch'
import dotenv from 'dotenv'
import * as utilityService from './utilityService'
import * as fileService from './fileService'
import { createError, handleErrorResponse, withErrorHandling } from '../utils/errorUtils'

dotenv.config()

const JIRA_URL = process.env.JIRA_URL as string
const JIRA_TOKEN = process.env.JIRA_TOKEN as string
let USER = null as any

export const getJiraCardByNumber = async (jiraCardNumber: string): Promise<JiraCard> => {
  const response = await fetchWithToken(`${JIRA_URL}${jiraCardNumber}`, JIRA_TOKEN)
  handleErrorResponse(response, `Failed to fetch Jira card with number ${jiraCardNumber}`)
  return response.data as JiraCard
}

export const getJiraCardDescription = withErrorHandling(
  async (jiraCardNumber: string): Promise<string> => {
    const jiraCard = await getJiraCardByNumber(jiraCardNumber)
    return jiraCard.fields.description
  },
  (jiraCardNumber: string) => `No description found for Jira card ${jiraCardNumber}`
)

export const getJiraSubtasks = async (jiraCardNumber: string): Promise<JiraSubtask[]> => {
  const jiraCard = await getJiraCardByNumber(jiraCardNumber)
  if (!jiraCard.fields.subtasks) {
    throw createError(`No subtasks found for Jira card ${jiraCardNumber}`, 404)
  }
  return jiraCard.fields.subtasks.map((subtask: JiraSubtask) => ({
    key: subtask.key,
    fields: { summary: subtask.fields.summary }
  }))
}

export const getJiraCardDids = withErrorHandling(async (jiraCardNumber: string): Promise<JiraDid[]> => {
  const [rawDescription, tableHeaders, tableContents] = await utilityService.resolvePromises([
    getJiraCardDescription(jiraCardNumber),
    fileService.getJiraTableHeaders(),
    fileService.getJiraTableContentMapping()
  ])

  const tableHeadersMapping = new Map<string, string>(
    tableHeaders.map((header: JiraHeader) => [header.tableHeader, header.attribute])
  )

  const tableContentMapping = new Map<string, string>(
    tableContents.map((content: JiraContentMapping) => [
      `${content.attribute}${content.campaign}${content.ibSkill}${content.jiraContent}`,
      content.lmContent
    ])
  )

  return utilityService.getDidsFromJiraCardDescription(
    rawDescription,
    tableHeadersMapping,
    tableContentMapping
  )
}, (jiraCardNumber: string) => `Failed to fetch DIDs for Jira card ${jiraCardNumber}`)

export const handleDevTaskCreation = async (
  jiraCard: JiraCard,
  description: string,
  title: string
): Promise<string> => {
  const jiraSubtasks = await getJiraSubtasks(jiraCard.key)
  const existingSubtask = jiraSubtasks.find((subtask: JiraSubtask) => subtask.fields.summary === title)

  if (!existingSubtask) {
    await createSingleDevTask(jiraCard, description, title)
    return `${title} => CREATED SUCCESSFULLY\n`
  } else {
    await updateSingleDevTask(existingSubtask.key, description)
    return `${title} => UPDATED SUCCESSFULLY\n`
  }
}

const setCurrentUser = async (jiraCardNumber: string): Promise<{ key: string, name: string }> => {
  if (USER === null) {
    const response = await fetchWithToken('https://jira.cignium.com/rest/api/latest/myself', JIRA_TOKEN)
    handleErrorResponse(response, 'Failed to retrieve current Jira user')
    USER = response.data
  }

  const jsonBody = { key: USER.key, name: USER.name }
  const response = await putWithToken(
    `https://jira.cignium.com/rest/api/latest/issue/${jiraCardNumber}/assignee`,
    JSON.stringify(jsonBody),
    JIRA_TOKEN
  )
  handleErrorResponse(response, `Failed to set current user for Jira card ${jiraCardNumber}`)
  return USER
}

// Create a new development task as a subtask of a Jira card
export const createSingleDevTask = async (
  jiraCard: JiraCard,
  description: string,
  title: string
): Promise<any> => {
  const jsonBody = {
    fields: {
      parent: { id: jiraCard.id },
      project: { id: jiraCard.fields.project.id },
      summary: title,
      description,
      issuetype: { id: '5' } // DEV_TASK_ISSUE_TYPE_ID
    }
  }
  const response = await postWithToken(JIRA_URL, JSON.stringify(jsonBody), JIRA_TOKEN)
  handleErrorResponse(response, `Failed to create dev task for Jira card ${jiraCard.key}`)
  await setCurrentUser(response.data.key)
  return response.data
}

// Update an existing development task description
export const updateSingleDevTask = async (
  jiraCardNumber: string,
  description: string
): Promise<any> => {
  const jsonBody = { fields: { description } }
  const response = await putWithToken(
    `${JIRA_URL}${jiraCardNumber}`,
    JSON.stringify(jsonBody),
    JIRA_TOKEN
  )
  handleErrorResponse(response, `Failed to update dev task for Jira card ${jiraCardNumber}`)
  await setCurrentUser(jiraCardNumber)
  return response.data
}
