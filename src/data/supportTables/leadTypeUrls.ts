import { LmLeadTypeUrl } from '../../types'

const createleadTypeUrl = (campaign: string, leadtypeurl: string): LmLeadTypeUrl => {
  return { campaign, leadtypeurl }
}
const buildLeadTypeUrls = (): LmLeadTypeUrl[] => {
  const leadTypeUrlArray = []
  leadTypeUrlArray.push(
    createleadTypeUrl('WCMA', 'https://lm.cignium.com/run/cignium/cuy-wcma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}'),
    createleadTypeUrl('SMA', 'https://lm.cignium.com/run/cignium/cuy-sma/{environment}/lead-type?CreateReason={CreateReason:string}&Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}'),
    createleadTypeUrl('OMA', 'https://lm.cignium.com/run/cignium/cuy-oma/{environment}/lead-type?Cid={Cid:string}&Did={Did:string}&Afid={Afid:string}'),
    createleadTypeUrl('MAQL', 'https://lm.cignium.com/run/cignium/cuy-maql/{environment}/lead-type-table-rule?Cid={Cid:string}&CreateReason={CreateReason:string}&Did={Did:string}&Afid={Afid:string}'),
    createleadTypeUrl('KPMA', 'https://lm.cignium.com/run/cignium/cuy-kpma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}'),
    createleadTypeUrl('HMA', 'https://lm.cignium.com/run/cignium/cuy-hma/{environment}/lead-type?Cid={Cid:string}&Did={Did:string}&Afid={Afid:string}'),
    createleadTypeUrl('CMA', 'https://lm.cignium.com/run/cignium/cuy-cma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}'),
    createleadTypeUrl('BCMA', 'https://lm.cignium.com/run/cignium/cuy-bcma/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}'),
    createleadTypeUrl('ANMO', 'https://lm.cignium.com/run/cignium/cuy-anmo/{environment}/lead-type?Cid={Cid:string}&Did={Did:string}&Afid={Afid:string}'),
    createleadTypeUrl('ANMA', 'https://lm.cignium.com/run/cignium/cuy-anma/{environment}/lead-type?ZipCode={ZipCode:string}&Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}'),
    createleadTypeUrl('AMA', 'https://lm.cignium.com/run/cignium/cuy-ama/{environment}/lead-type?Did={Did:string}&Afid={Afid:string}&Cid={Cid:string}')
  )
  return leadTypeUrlArray
}

export const leadTypeUrls = buildLeadTypeUrls()

export default leadTypeUrls
