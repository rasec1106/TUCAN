import { JiraContentMapping } from '../../types'

const createContentMapping = (campaign: string, ibSkill: string, attribute: string, jiraContent: string, lmContent: string): JiraContentMapping => {
  return { campaign, ibSkill, attribute, jiraContent, lmContent }
}

const buildContentMapping = (): JiraContentMapping[] => {
  const mapping = []
  mapping.push(
    createContentMapping('AMA', 'SB00', 'abhRouting', 'LiveOps', 'LiveOps'),
    createContentMapping('AMA', 'SB00', 'dbhRouting', 'LiveOps', 'LiveOps')
  )
  return mapping
}

export const jiraTableContentMapping = buildContentMapping()

export default jiraTableContentMapping
