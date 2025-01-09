// jiraTableHeaders.test.ts
import { jiraTableHeaders } from '../../../data/supportTables/jiraTableHeaders'
import { JiraHeader } from '../../../types'

// Test suite for jiraTableHeaders
describe('jiraTableHeaders', () => {
  it('should be an array of JiraHeader objects', () => {
    expect(Array.isArray(jiraTableHeaders)).toBe(true)
    expect(jiraTableHeaders.length).toBeGreaterThan(0)
    jiraTableHeaders.forEach(header => {
      expect(header).toHaveProperty('tableHeader')
      expect(header).toHaveProperty('attribute')
    })
  })

  it('should match the expected headers', () => {
    const expectedHeaders: JiraHeader[] = [
      { tableHeader: 'LeadType', attribute: 'leadType' },
      { tableHeader: 'After Business Hour Overflow Number', attribute: 'abhOverflow' },
      { tableHeader: 'After Business Hour Overflow Routing', attribute: 'abhRouting' },
      { tableHeader: 'During Business Hour Overflow Number', attribute: 'dbhOverflow' },
      { tableHeader: 'During Business Hour Overflow Routing', attribute: 'dbhRouting' },
      { tableHeader: 'OB Skill', attribute: 'obSkill' },
      { tableHeader: 'IB Skill', attribute: 'ibSkill' },
      { tableHeader: 'IVR Greeting', attribute: 'greeting' },
      { tableHeader: 'IVR', attribute: 'ivr' },
      { tableHeader: 'DID Description', attribute: 'description' },
      { tableHeader: 'DID', attribute: 'did' },
      { tableHeader: 'Campaign', attribute: 'campaign' },
      { tableHeader: 'AFID Description', attribute: 'afidDescription' },
      { tableHeader: 'AFID', attribute: 'afid' },
      { tableHeader: 'CID', attribute: 'cid' }
    ]

    expect(jiraTableHeaders).toEqual(expectedHeaders)
  })
})
