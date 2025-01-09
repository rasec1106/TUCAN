// obSubcampaignUrls.test.ts
import { obSubcampaignUrls } from '../../../data/supportTables/obSubcampaignUrls'
import { LmObSubcampaignUrl } from '../../../types'

// Test suite for obSubcampaignUrls
describe('obSubcampaignUrls', () => {
  it('should be an array of LmObSubcampaignUrl objects', () => {
    expect(Array.isArray(obSubcampaignUrls)).toBe(true)
    expect(obSubcampaignUrls.length).toBeGreaterThan(0)
    obSubcampaignUrls.forEach(urlObject => {
      expect(urlObject).toHaveProperty('campaign')
      expect(urlObject).toHaveProperty('obsubcampaignurl')
    })
  })

  it('should match the expected URLs for each campaign', () => {
    const expectedUrls: LmObSubcampaignUrl[] = [
      { campaign: 'WCMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-wcma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'SMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-sma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&SID={SID:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'OMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-oma/{environment}/dnis-subcampaign-ob?Carrier={Carrier:string}&CID={CID:string}&SID={SID:string}&Tier={Tier:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'MAQL', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-maql/{environment}/dnis-subcampaign-ob?AFID={AFID:string}&CreateReason={CreateReason:string}&Carrier={Carrier:string}&CID={CID:string}&Tier={Tier:string}' },
      { campaign: 'KPMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-kpma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'HMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-hma/{environment}/dnis-subcampaign-ob?RecalculateReason={RecalculateReason:string}&Cid={Cid:string}&CreateReason={CreateReason:string}&Afid={Afid:string}&Tier={Tier:string}&Did={Did:string}' },
      { campaign: 'CMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-cma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'BCMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-bcma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'ANMO', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-anmo/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'ANMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-anma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' },
      { campaign: 'AMA', obsubcampaignurl: 'https://lm.cignium.com/run/cignium/cuy-ama/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}' }
    ]

    expect(obSubcampaignUrls).toEqual(expectedUrls)
  })
})
