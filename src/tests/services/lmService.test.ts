import {
  getLmAfidTfn,
  getLmLeadType,
  getLmObSubcampaign,
  getV1IvrParameters,
  getV1AdditionalIvrParameters,
  getV1AfterHoursRouting,
  getV1AgentUnavailableParameters,
  getV1AgentUnavailableRouting,
  getV1RoutingOptionsByTfn,
  getV2DidsFromIvrConfig,
  getV2DidRoutingFromIvrConfig
} from '../../services/lmService'
import { fetchData } from '../../utils/fetch'

jest.mock('../../utils/fetch')

// Base JiraDid object to use in tests
const baseJiraDid = {
  afid: 'sampleAfid',
  campaign: 'sampleCampaign',
  did: 'sampleDid',
  description: 'sampleDescription',
  ivr: 'sampleIvr',
  greeting: 'sampleGreeting',
  ibSkill: 'sampleIbSkill',
  obSkill: 'sampleObSkill',
  dbhRouting: 'sampleDbhRouting',
  dbhOverflow: 'sampleDbhOverflow',
  abhRouting: 'sampleAbhRouting',
  abhOverflow: 'sampleAbhOverflow',
  leadType: 'sampleLeadType'
}

describe('lmService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getLmAfidTfn', () => {
    it('should fetch the AFID based on the Jira DID', async () => {
      const mockResponse = { Afid: 'sampleAfid' }
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getLmAfidTfn(baseJiraDid)
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getLmLeadType', () => {
    it('should fetch the lead type based on the Jira DID and leadTypeUrl', async () => {
      const leadTypeUrl = 'https://example.com/leadtype'
      const mockResponse = { LeadType: 'sampleLeadType' }
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getLmLeadType(baseJiraDid, leadTypeUrl)
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(leadTypeUrl, expect.any(Object))
    })
  })

  describe('getLmObSubcampaign', () => {
    it('should fetch the OB subcampaign based on the Jira DID and obSubcampaignUrl', async () => {
      const obSubcampaignUrl = 'https://example.com/subcampaign'
      const mockResponse = { SubCampaign: 'sampleSubcampaign' }
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getLmObSubcampaign(baseJiraDid, obSubcampaignUrl)
      expect(result).toEqual({ SubCampaign: 'sampleSubcampaign' })
      expect(fetchData).toHaveBeenCalledWith(obSubcampaignUrl, expect.any(Object))
    })
  })

  describe('getV1IvrParameters', () => {
    it('should fetch V1 IVR parameters', async () => {
      const mockResponse = [{ id: 'param1' }, { id: 'param2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV1IvrParameters()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV1AdditionalIvrParameters', () => {
    it('should fetch V1 additional IVR parameters', async () => {
      const mockResponse = [{ id: 'additionalParam1' }, { id: 'additionalParam2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV1AdditionalIvrParameters()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV1AfterHoursRouting', () => {
    it('should fetch V1 after hours routing', async () => {
      const mockResponse = [{ id: 'afterHours1' }, { id: 'afterHours2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV1AfterHoursRouting()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV1AgentUnavailableParameters', () => {
    it('should fetch V1 agent unavailable parameters', async () => {
      const mockResponse = [{ id: 'unavailableParam1' }, { id: 'unavailableParam2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV1AgentUnavailableParameters()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV1AgentUnavailableRouting', () => {
    it('should fetch V1 agent unavailable routing', async () => {
      const mockResponse = [{ id: 'unavailableRouting1' }, { id: 'unavailableRouting2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV1AgentUnavailableRouting()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV1RoutingOptionsByTfn', () => {
    it('should fetch V1 routing options by TFN', async () => {
      const mockResponse = [{ id: 'routingOption1' }, { id: 'routingOption2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV1RoutingOptionsByTfn()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV2DidsFromIvrConfig', () => {
    it('should fetch V2 DIDs from IVR config', async () => {
      const mockResponse = [{ id: 'did1' }, { id: 'did2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV2DidsFromIvrConfig()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })

  describe('getV2DidRoutingFromIvrConfig', () => {
    it('should fetch V2 DID routing from IVR config', async () => {
      const mockResponse = [{ id: 'didRouting1' }, { id: 'didRouting2' }]
        ;(fetchData as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getV2DidRoutingFromIvrConfig()
      expect(result).toEqual(mockResponse)
      expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })
  })
})
