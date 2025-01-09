import { getLmLeadTypeUrl, getLmObSubcampaignUrl, getJiraTableHeaders, getJiraTableContentMapping, getLmIvr } from '../../services/fileService'
import leadTypeUrls from '../../data/supportTables/leadTypeUrls'
import obSubcampaignUrls from '../../data/supportTables/obSubcampaignUrls'
import jiraTableHeaders from '../../data/supportTables/jiraTableHeaders'
import jiraTableContentMapping from '../../data/supportTables/jiraTableContentMapping'
import ivrMappings from '../../data/supportTables/ivrMappings'

jest.mock('../../data/supportTables/leadTypeUrls', () => ([
  { campaign: 'WCMA', leadtypeurl: 'mock-url-1' },
  { campaign: 'SMA', leadtypeurl: 'mock-url-2' }
]))
jest.mock('../../data/supportTables/obSubcampaignUrls', () => ([
  { campaign: 'WCMA', obsubcampaignurl: 'mock-url-1' },
  { campaign: 'SMA', obsubcampaignurl: 'mock-url-2' }
]))
jest.mock('../../data/supportTables/jiraTableHeaders', () => ([
  { tableHeader: 'LeadType', attribute: 'leadType' },
  { tableHeader: 'OB Skill', attribute: 'obSkill' }
]))
jest.mock('../../data/supportTables/jiraTableContentMapping', () => ([
  { campaign: 'AMA', ibSkill: 'SB00', attribute: 'abhRouting', jiraContent: 'LiveOps', lmContent: 'LiveOps' }
]))
jest.mock('../../data/supportTables/ivrMappings', () => ([
  { name: 'IVR1', pathId: 'path-id-1' },
  { name: 'IVR2', pathId: 'path-id-2' }
]))

describe('fileService', () => {
  test('getLmLeadTypeUrl should return leadTypeUrls array', async () => {
    const result = await getLmLeadTypeUrl()
    expect(result).toEqual(leadTypeUrls)
  })

  test('getLmObSubcampaignUrl should return obSubcampaignUrls array', async () => {
    const result = await getLmObSubcampaignUrl()
    expect(result).toEqual(obSubcampaignUrls)
  })

  test('getJiraTableHeaders should return jiraTableHeaders array', async () => {
    const result = await getJiraTableHeaders()
    expect(result).toEqual(jiraTableHeaders)
  })

  test('getJiraTableContentMapping should return jiraTableContentMapping array', async () => {
    const result = await getJiraTableContentMapping()
    expect(result).toEqual(jiraTableContentMapping)
  })

  test('getLmIvr should return ivrMappings array', async () => {
    const result = await getLmIvr()
    expect(result).toEqual(ivrMappings)
  })
})
