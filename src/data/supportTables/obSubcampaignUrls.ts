import { LmObSubcampaignUrl } from '../../types'

const createObSubcampaignUrl = (campaign: string, obsubcampaignurl: string): LmObSubcampaignUrl => {
  return { campaign, obsubcampaignurl }
}
const buildObSubcampaignUrls = (): LmObSubcampaignUrl[] => {
  const obSubcampaignUrlArray = []
  obSubcampaignUrlArray.push(
    createObSubcampaignUrl('WCMA', 'https://lm.cignium.com/run/cignium/cuy-wcma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('SMA', 'https://lm.cignium.com/run/cignium/cuy-sma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&SID={SID:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('OMA', 'https://lm.cignium.com/run/cignium/cuy-oma/{environment}/dnis-subcampaign-ob?Carrier={Carrier:string}&CID={CID:string}&SID={SID:string}&Tier={Tier:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('MAQL', 'https://lm.cignium.com/run/cignium/cuy-maql/{environment}/dnis-subcampaign-ob?AFID={AFID:string}&CreateReason={CreateReason:string}&Carrier={Carrier:string}&CID={CID:string}&Tier={Tier:string}'),
    createObSubcampaignUrl('KPMA', 'https://lm.cignium.com/run/cignium/cuy-kpma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('HMA', 'https://lm.cignium.com/run/cignium/cuy-hma/{environment}/dnis-subcampaign-ob?RecalculateReason={RecalculateReason:string}&Cid={Cid:string}&CreateReason={CreateReason:string}&Afid={Afid:string}&Tier={Tier:string}&Did={Did:string}'),
    createObSubcampaignUrl('CMA', 'https://lm.cignium.com/run/cignium/cuy-cma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('BCMA', 'https://lm.cignium.com/run/cignium/cuy-bcma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('ANMO', 'https://lm.cignium.com/run/cignium/cuy-anmo/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('ANMA', 'https://lm.cignium.com/run/cignium/cuy-anma/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}'),
    createObSubcampaignUrl('AMA', 'https://lm.cignium.com/run/cignium/cuy-ama/{environment}/dnis-subcampaign-ob?Tier={Tier:string}&CID={CID:string}&CreateReason={CreateReason:string}&AFID={AFID:string}')
  )
  return obSubcampaignUrlArray
}

export const obSubcampaignUrls = buildObSubcampaignUrls()

export default obSubcampaignUrls
