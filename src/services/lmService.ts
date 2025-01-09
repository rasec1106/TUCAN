import {
  LmAfid, LmDidV2, JiraDid, LmLeadType, LmObSubcampaign,
  LmDidRoutingV2, LmIvrParametersV1, LmAdditionalIvrParametersV1,
  LmAfterHoursRoutingV1, LmAgentUnavailableParametersV1,
  LmAgentUnavailableRoutingV1, LmRoutingOptionsByTfnV1
} from '../types'

import { fetchData } from '../utils/fetch'
import { validateUrl } from '../utils/configUtils'
import { withErrorHandling, createError } from '../utils/errorUtils'
import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT = process.env.ENVIRONMENT as string

const LM_V1_IVR_PARAMETERS_URL = process.env.LM_V1_IVR_PARAMETERS_URL
const LM_V1_ADDITIONAL_IVR_PARAMETERS_URL = process.env.LM_V1_ADDITIONAL_IVR_PARAMETERS_URL
const LM_V1_AFTER_HOURS_ROUTING_URL = process.env.LM_V1_AFTER_HOURS_ROUTING_URL
const LM_V1_AGENT_UNAVAILABLE_PARAMETERS_URL = process.env.LM_V1_AGENT_UNAVAILABLE_PARAMETERS_URL
const LM_V1_AGENT_UNAVAILABLE_ROUTING_URL = process.env.LM_V1_AGENT_UNAVAILABLE_ROUTING_URL
const LM_V1_ROUTING_OPTIONS_BY_TFN_URL = process.env.LM_V1_ROUTING_OPTIONS_BY_TFN_URL
const LM_V2_DIDS_URL = process.env.LM_V2_DIDS_URL
const LM_V2_DID_ROUTING_URL = process.env.LM_V2_DID_ROUTING_URL
const LM_AFID_BY_TFN = process.env.LM_AFID_BY_TFN

// Version 1 Functions
export const getV1IvrParameters = withErrorHandling(
  async () => await fetchData<LmIvrParametersV1[]>(validateUrl(LM_V1_IVR_PARAMETERS_URL, 'LM_V1_IVR_PARAMETERS_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V1 IVR parameters'
)

export const getV1AdditionalIvrParameters = withErrorHandling(
  async () => await fetchData<LmAdditionalIvrParametersV1[]>(validateUrl(LM_V1_ADDITIONAL_IVR_PARAMETERS_URL, 'LM_V1_ADDITIONAL_IVR_PARAMETERS_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V1 additional IVR parameters'
)

export const getV1AfterHoursRouting = withErrorHandling(
  async () => await fetchData<LmAfterHoursRoutingV1[]>(validateUrl(LM_V1_AFTER_HOURS_ROUTING_URL, 'LM_V1_AFTER_HOURS_ROUTING_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V1 after hours routing'
)

export const getV1AgentUnavailableParameters = withErrorHandling(
  async () => await fetchData<LmAgentUnavailableParametersV1[]>(validateUrl(LM_V1_AGENT_UNAVAILABLE_PARAMETERS_URL, 'LM_V1_AGENT_UNAVAILABLE_PARAMETERS_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V1 agent unavailable parameters'
)

export const getV1AgentUnavailableRouting = withErrorHandling(
  async () => await fetchData<LmAgentUnavailableRoutingV1[]>(validateUrl(LM_V1_AGENT_UNAVAILABLE_ROUTING_URL, 'LM_V1_AGENT_UNAVAILABLE_ROUTING_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V1 agent unavailable routing'
)

export const getV1RoutingOptionsByTfn = withErrorHandling(
  async () => await fetchData<LmRoutingOptionsByTfnV1[]>(validateUrl(LM_V1_ROUTING_OPTIONS_BY_TFN_URL, 'LM_V1_ROUTING_OPTIONS_BY_TFN_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V1 routing options by TFN'
)

// Version 2 Functions
export const getV2DidsFromIvrConfig = withErrorHandling(
  async () => await fetchData<LmDidV2[]>(validateUrl(LM_V2_DIDS_URL, 'LM_V2_DIDS_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V2 DIDs from IVR config'
)

export const getV2DidRoutingFromIvrConfig = withErrorHandling(
  async () => await fetchData<LmDidRoutingV2[]>(validateUrl(LM_V2_DID_ROUTING_URL, 'LM_V2_DID_ROUTING_URL'), { environment: ENVIRONMENT }),
  'Failed to fetch V2 DID routing from IVR config'
)

// Extra Element Functions
export const getLmAfidTfn = withErrorHandling(
  async (jiraDid: JiraDid) => await fetchData<LmAfid>(validateUrl(LM_AFID_BY_TFN, 'LM_AFID_BY_TFN'), {
    environment: ENVIRONMENT,
    'Campaign:string': jiraDid.campaign,
    'Tfn:string': jiraDid.did
  }),
  'Failed to fetch AFID by TFN'
)

export const getLmLeadType = withErrorHandling(
  async (jiraDid: JiraDid, leadtypeUrl?: string) => {
    if (!leadtypeUrl) throw createError("The leadtype URL doesn't exist", 400)
    return await fetchData<LmLeadType>(leadtypeUrl, {
      environment: ENVIRONMENT,
      'Did:string': jiraDid.did,
      'Afid:string': jiraDid.afid,
      'AFID:string': jiraDid.afid
    })
  },
  'Failed to fetch lead type'
)

// export const getLmObSubcampaign = withErrorHandling(
//   async (jiraDid: JiraDid, obSubcampaignUrl?: string) => {
//     if (!obSubcampaignUrl) throw createError("The subCampaign URL doesn't exist", 400)
//     const data = await fetchData<{ Subcampaign?: string, SubCampaign?: string }>(obSubcampaignUrl, {
//       environment: ENVIRONMENT,
//       'Did:string': jiraDid.did,
//       'Afid:string': jiraDid.afid,
//       'AFID:string': jiraDid.afid
//     })

//     return { SubCampaign: jiraDid.campaign === 'HMA' ? data.Subcampaign : data.SubCampaign }
//   },
//   'Failed to fetch OB subcampaign'
// )

export const getLmObSubcampaign = withErrorHandling(
  async (jiraDid: JiraDid, obSubcampaignUrl?: string): Promise<LmObSubcampaign> => {
    if (!obSubcampaignUrl) throw createError("The subCampaign URL doesn't exist", 400)

    const data = await fetchData<{ Subcampaign?: string, SubCampaign?: string }>(obSubcampaignUrl, {
      environment: ENVIRONMENT,
      'Did:string': jiraDid.did,
      'Afid:string': jiraDid.afid,
      'AFID:string': jiraDid.afid
    })

    const result: LmObSubcampaign = {
      SubCampaign: jiraDid.campaign === 'HMA' ? (data.Subcampaign ?? null) : (data.SubCampaign ?? null)
    }

    return result
  },
  'Failed to fetch OB subcampaign'
)
