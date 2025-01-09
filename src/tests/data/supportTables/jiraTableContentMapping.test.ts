import { JiraContentMapping } from '../../../types'
import { jiraTableContentMapping } from '../../../data/supportTables/jiraTableContentMapping'

// Tests for jiraTableContentMapping
describe('jiraTableContentMapping', () => {
  it('should return an array of JiraContentMapping objects', () => {
    expect(Array.isArray(jiraTableContentMapping)).toBe(true)
    jiraTableContentMapping.forEach((item) => {
      expect(item).toMatchObject<JiraContentMapping>({
        campaign: expect.any(String),
        ibSkill: expect.any(String),
        attribute: expect.any(String),
        jiraContent: expect.any(String),
        lmContent: expect.any(String)
      })
    })
  })

  it('should contain specific mappings', () => {
    expect(jiraTableContentMapping).toEqual(
      expect.arrayContaining([
        {
          campaign: 'AMA',
          ibSkill: 'SB00',
          attribute: 'abhRouting',
          jiraContent: 'LiveOps',
          lmContent: 'LiveOps'
        },
        {
          campaign: 'AMA',
          ibSkill: 'SB00',
          attribute: 'dbhRouting',
          jiraContent: 'LiveOps',
          lmContent: 'LiveOps'
        },
      ])
    )
  })
})
