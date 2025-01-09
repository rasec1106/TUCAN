import leadTypeUrls from '../data/supportTables/leadTypeUrls'
import obSubcampaignUrls from '../data/supportTables/obSubcampaignUrls'
import jiraTableHeaders from '../data/supportTables/jiraTableHeaders'
import jiraTableContentMapping from '../data/supportTables/jiraTableContentMapping'
import ivrMappings from '../data/supportTables/ivrMappings'
import { JiraContentMapping, JiraHeader, LmIvrNameToPathId, LmLeadTypeUrl, LmObSubcampaignUrl } from '../types'
import { withErrorHandling } from '../utils/errorUtils'

export const getLmLeadTypeUrl = withErrorHandling(
  async (): Promise<LmLeadTypeUrl[]> => leadTypeUrls,
  'Error reading file for lead type URLs'
)

export const getLmObSubcampaignUrl = withErrorHandling(
  async (): Promise<LmObSubcampaignUrl[]> => obSubcampaignUrls,
  'Error reading file for OB subcampaign URLs'
)

export const getJiraTableHeaders = withErrorHandling(
  async (): Promise<JiraHeader[]> => jiraTableHeaders,
  'Error reading file for Jira table headers'
)

export const getJiraTableContentMapping = withErrorHandling(
  async (): Promise<JiraContentMapping[]> => jiraTableContentMapping,
  'Error reading file for Jira Content Mapping'
)

export const getLmIvr = withErrorHandling(
  async (): Promise<LmIvrNameToPathId[]> => await ivrMappings,
  'Error reading file for IVR mappings'
)
