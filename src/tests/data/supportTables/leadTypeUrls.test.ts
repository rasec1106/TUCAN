// leadTypeUrls.test.ts
import { leadTypeUrls } from '../../../data/supportTables/leadTypeUrls'
import { LmLeadTypeUrl } from '../../../types'

// Test suite for leadTypeUrls
describe('leadTypeUrls', () => {
  it('should be an array of LmLeadTypeUrl objects', () => {
    expect(Array.isArray(leadTypeUrls)).toBe(true)
    expect(leadTypeUrls.length).toBeGreaterThan(0)
    leadTypeUrls.forEach(urlObject => {
      expect(urlObject).toHaveProperty('campaign')
      expect(urlObject).toHaveProperty('leadtypeurl')
    })
  })

  it('should match the expected URLs for each campaign', () => {
    const expectedUrls: LmLeadTypeUrl[] = [
      { campaign: 'WCMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-wcma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' },
      { campaign: 'SMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-sma/{environment}/lead-type?CreateReason={CreateReason:string}&Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' },
      { campaign: 'OMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-oma/{environment}/lead-type?Cid={Cid:string}&Did={Did:string}&Afid={Afid:string}' },
      { campaign: 'MAQL', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-maql/{environment}/lead-type-table-rule?Cid={Cid:string}&CreateReason={CreateReason:string}&Did={Did:string}&Afid={Afid:string}' },
      { campaign: 'KPMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-kpma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' },
      { campaign: 'HMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-hma/{environment}/lead-type?Cid={Cid:string}&Did={Did:string}&Afid={Afid:string}' },
      { campaign: 'CMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-cma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' },
      { campaign: 'BCMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-bcma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' },
      { campaign: 'ANMO', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-anmo/{environment}/lead-type?Cid={Cid:string}&Did={Did:string}&Afid={Afid:string}' },
      { campaign: 'ANMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-anma/{environment}/lead-type?ZipCode={ZipCode:string}&Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' },
      { campaign: 'AMA', leadtypeurl: 'https://lm.cignium.com/run/cignium/cuy-ama/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}' }
    ]

    expect(leadTypeUrls).toEqual(expectedUrls)
  })
})
