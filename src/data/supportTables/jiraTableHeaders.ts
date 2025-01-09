import { JiraHeader } from '../../types'

const createJiraTableHeader = (tableHeader: string, attribute: string): JiraHeader => {
  return { tableHeader, attribute }
}

const buildHeaders = (): JiraHeader[] => {
  const headers = []
  headers.push(
    createJiraTableHeader('LeadType', 'leadType'),
    createJiraTableHeader('After Business Hour Overflow Number', 'abhOverflow'),
    createJiraTableHeader('After Business Hour Overflow Routing', 'abhRouting'),
    createJiraTableHeader('During Business Hour Overflow Number', 'dbhOverflow'),
    createJiraTableHeader('During Business Hour Overflow Routing', 'dbhRouting'),
    createJiraTableHeader('OB Skill', 'obSkill'),
    createJiraTableHeader('IB Skill', 'ibSkill'),
    createJiraTableHeader('IVR Greeting', 'greeting'),
    createJiraTableHeader('IVR', 'ivr'),
    createJiraTableHeader('DID Description', 'description'),
    createJiraTableHeader('DID', 'did'),
    createJiraTableHeader('Campaign', 'campaign'),
    createJiraTableHeader('AFID Description', 'afidDescription'), // to develop how it will impact the dev plan
    createJiraTableHeader('AFID', 'afid'),
    createJiraTableHeader('CID', 'cid')
  )
  return headers
}

export const jiraTableHeaders = buildHeaders()

export default jiraTableHeaders
