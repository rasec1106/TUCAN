import { LmDidV2, JiraDid, ValidationContent, ValidationElement, ValidationResponse, LmLeadTypeUrl, LmLeadType, LmObSubcampaignUrl, LmObSubcampaign, LmAfid, LmDidRoutingV2, LmDidV1, LmDidV1Structure, DidConfigStructure, LmDidV2Structure, LmIvrNameToPathId } from '../types'
import * as lmService from './lmService'
import * as jiraService from './jiraService'
import * as fileService from './fileService'
import * as utilityService from './utilityService'

const BYPASS_VALIDATION = 'Validation for this attribute can be bypassed'

export const compareDids = async (jiraCardNumber: string): Promise<ValidationResponse> => {
  const validationResponse: ValidationResponse = {
    isValid: false,
    nonValidElements: [],
    validation: []
  }
  const [
    jiraDids,
    lmLeadTypeUrlArray,
    lmObSubcampaignUrlArray
  ] = await utilityService.resolvePromises([
    jiraService.getJiraCardDids(jiraCardNumber),
    fileService.getLmLeadTypeUrl(),
    fileService.getLmObSubcampaignUrl()
  ])
  const validationElementArray: ValidationElement[] = []
  const nonValidDids: ValidationElement[] = []
  const [v1Dids, v2Dids] = utilityService.partitionArrayByVersion(jiraDids)

  await utilityService.resolvePromises([
    validateDids(v1Dids, lmLeadTypeUrlArray, lmObSubcampaignUrlArray, validationElementArray, nonValidDids),
    validateDids(v2Dids, lmLeadTypeUrlArray, lmObSubcampaignUrlArray, validationElementArray, nonValidDids)
  ])

  validationResponse.isValid = validationElementArray.every(v => v.isValid)
  validationResponse.nonValidElements = nonValidDids
  validationResponse.validation = validationElementArray
  return validationResponse
}

const createValidationContent = (attribute: string, jiraValue: string | null | undefined, lmValue: string | null | undefined): ValidationContent => {
  if (jiraValue === JSON.stringify(BYPASS_VALIDATION)) jiraValue = BYPASS_VALIDATION
  return {
    isValid: jiraValue === BYPASS_VALIDATION ? true : (jiraValue === lmValue),
    attribute,
    jiraDid: jiraValue ?? 'undefined',
    lmDid: lmValue ?? 'undefined'
  }
}

const resolveLmPromisesForDid = async (jiraDids: JiraDid[], lmDids: LmDidV1[] | LmDidV2[], lmLeadTypeUrlArray: LmLeadTypeUrl[], lmObSubcampaignUrlArray: LmObSubcampaignUrl[]): Promise<Array<LmLeadType | LmObSubcampaign | LmAfid | undefined>> => {
  const promiseArray: any[] = []
  for (const jiraDid of jiraDids) {
    const configuredDid = lmDids.find(lmDid => lmDid.DID === jiraDid.did)
    if (configuredDid !== undefined) {
      promiseArray.push(
        lmService.getLmAfidTfn(jiraDid),
        lmService.getLmLeadType(jiraDid, lmLeadTypeUrlArray.find(val => val.campaign === jiraDid.campaign)?.leadtypeurl),
        lmService.getLmObSubcampaign(jiraDid, lmObSubcampaignUrlArray.find(val => val.campaign === jiraDid.campaign)?.obsubcampaignurl)
      )
    }
  }
  return await utilityService.resolvePromises(promiseArray)
}

const validateDids = async (dids: JiraDid[], lmLeadTypeUrlArray: LmLeadTypeUrl[], lmObSubcampaignUrlArray: LmObSubcampaignUrl[], validationElementArray: ValidationElement[], nonValidDids: ValidationElement[]): Promise<void> => {
  if (dids.length === 0) return
  let lmDids: LmDidV1[] | LmDidV2[]
  let lmDidRoutingArray: LmDidRoutingV2[]
  let lmStructureMappingArray: LmIvrNameToPathId[]
  if (utilityService.isV1Campaign(dids[0].campaign)) {
    [lmDids, lmStructureMappingArray] = await utilityService.resolvePromises([utilityService.buildV1DidsFromLmTables(), fileService.getLmIvr()])
  } else {
    [lmDids, lmDidRoutingArray, lmStructureMappingArray] = await utilityService.resolvePromises([lmService.getV2DidsFromIvrConfig(), lmService.getV2DidRoutingFromIvrConfig(), fileService.getLmIvr()])
  }
  const resolvedLmPromises = await resolveLmPromisesForDid(dids, lmDids, lmLeadTypeUrlArray, lmObSubcampaignUrlArray)

  dids.forEach((jiraDid, index) => {
    const validationElement: ValidationElement = {
      isValid: false,
      did: jiraDid.did,
      content: []
    }
    let configuredDid: LmDidV1 | LmDidV2 | undefined
    utilityService.isV1Campaign(jiraDid.campaign)
      ? configuredDid = (lmDids as LmDidV1[]).find(lmDid => lmDid.DID === jiraDid.did)
      : configuredDid = (lmDids as LmDidV2[]).find(lmDid => lmDid.DID === jiraDid.did)
    const validationContentArray = []

    if (configuredDid === undefined) {
      const validation: ValidationContent = {
        isValid: false,
        attribute: 'Element not found in IVR-CONFIG',
        jiraDid: jiraDid.did,
        lmDid: 'undefined'
      }
      validationContentArray.push(validation)
    } else {
      const generatedDid = utilityService.getDidStructure(jiraDid, lmStructureMappingArray)
      if (generatedDid?.lmStructure === undefined) {
        validationContentArray.push({
          isValid: false,
          attribute: 'Missing IVR mapping in Valdicon tables',
          jiraDid: `Couldn't find a defined lmStructure for ivr ${jiraDid.ivr} in campaign ${jiraDid.campaign} and skill ${jiraDid.ibSkill}`,
          lmDid: configuredDid.DID
        })
      } else {
        const afidByTfn = resolvedLmPromises[index * 3] as LmAfid
        const leadTypePromise = resolvedLmPromises[index * 3 + 1] as LmLeadType
        const lmObSubcampaign = resolvedLmPromises[index * 3 + 2] as LmObSubcampaign

        if (leadTypePromise === undefined) throw new Error(`The did ${jiraDid.did} doesn't have a mapped leadType url for campaign ${jiraDid.campaign}`)
        if (lmObSubcampaign === undefined) throw new Error(`The did ${jiraDid.did} doesn't have a mapped obSkill url for campaign ${jiraDid.campaign}`)

        validationContentArray.push(
          createValidationContent('Afid', jiraDid.afid, afidByTfn.Afid),
          createValidationContent('LeadType', jiraDid.leadType, leadTypePromise.LeadType),
          createValidationContent('ObSkill', jiraDid.obSkill, lmObSubcampaign.SubCampaign),
          createValidationContent('Description', jiraDid.description, configuredDid.NumDescription),
          createValidationContent('Campaign', jiraDid.campaign, configuredDid.Campaign),
          ...compareLmStructure(generatedDid, configuredDid),
          ...compareOverflow(generatedDid, configuredDid, lmDidRoutingArray)
        )
      }
    }

    validationElement.content = validationContentArray
    validationElement.isValid = validationContentArray.every(v => v.isValid)
    if (!validationElement.isValid) {
      nonValidDids.push({
        isValid: false,
        did: jiraDid.did,
        content: validationContentArray.filter(val => !val.isValid)
      })
    }
    validationElementArray.push(validationElement)
  })
}

const compareLmStructure = (generatedDid: DidConfigStructure | undefined, lmDid: LmDidV1 | LmDidV2): ValidationContent[] => {
  if (utilityService.isV1Campaign(lmDid.Campaign)) {
    const lmStructure = generatedDid?.lmStructure as LmDidV1Structure
    return [
      createValidationContent('IvrParameters', JSON.stringify(lmStructure.ivrParameters), JSON.stringify((lmDid as LmDidV1).ivrParameters)),
      createValidationContent('AdditionalIvrParameters', JSON.stringify(lmStructure.additionalIvrParameters), JSON.stringify((lmDid as LmDidV1).additionalIvrParameters)),
      createValidationContent('AfterHoursRouting', JSON.stringify(lmStructure.afterHoursRouting ?? BYPASS_VALIDATION), JSON.stringify((lmDid as LmDidV1).afterHoursRouting)),
      createValidationContent('AgentUnavailableParameters', JSON.stringify(lmStructure.agentUnavailableParameters), JSON.stringify((lmDid as LmDidV1).agentUnavailableParameters)),
      createValidationContent('AgentUnavailableRouting', JSON.stringify(lmStructure.agentUnavailableRouting ?? BYPASS_VALIDATION), JSON.stringify((lmDid as LmDidV1).agentUnavailableRouting)),
      createValidationContent('RoutingOptions', JSON.stringify(lmStructure.routingOptions), JSON.stringify((lmDid as LmDidV1).routingOptions))
    ]
  } else {
    const lmStructure = generatedDid?.lmStructure as LmDidV2Structure
    return [
      createValidationContent('PathId', JSON.stringify(lmStructure.ivrDid?.PathID), JSON.stringify((lmDid as LmDidV2).PathID)),
      createValidationContent('PathCode', JSON.stringify(lmStructure.ivrDid?.PathCode), JSON.stringify((lmDid as LmDidV2).PathCode)),
      createValidationContent('IvrDid', JSON.stringify(lmStructure.ivrDid), JSON.stringify((lmDid as LmDidV2)))
    ]
  }
}

const compareOverflow = (generatedDid: DidConfigStructure | undefined, lmDid: LmDidV1 | LmDidV2, lmDidRoutingArray: LmDidRoutingV2[]): ValidationContent[] => {
  if (utilityService.isV1Campaign(lmDid.Campaign)) {
    const lmStructure = generatedDid?.lmStructure as LmDidV1Structure
    return [
      createValidationContent('DbhOverflowRouting', lmStructure.agentUnavailableParameters?.AgentUnavailableRoutingType, (lmDid as LmDidV1).agentUnavailableParameters?.AgentUnavailableRoutingType),
      createValidationContent('DbhOverflowNumber', lmStructure.agentUnavailableRouting?.Number, (lmDid as LmDidV1).agentUnavailableRouting?.Number),
      createValidationContent('AbhOverflowRouting', lmStructure.agentUnavailableParameters?.AfterHoursRoutingType, (lmDid as LmDidV1).agentUnavailableParameters?.AfterHoursRoutingType),
      createValidationContent('AbhOverflowNumber', lmStructure.afterHoursRouting?.Number, (lmDid as LmDidV1).afterHoursRouting?.Number)
    ]
  } else {
    const lmStructure = generatedDid?.lmStructure as LmDidV2Structure
    const didRoutingRecords = lmDidRoutingArray.filter(val => val.DID === lmStructure.ivrDid?.DID).sort((a, b) => a.Scenario.localeCompare(b.Scenario))
    const sortedRouting = lmStructure.ivrDidRouting?.sort((a, b) => a.Scenario.localeCompare(b.Scenario))
    return [
      createValidationContent('IvrDidRouting', JSON.stringify(sortedRouting ?? BYPASS_VALIDATION), JSON.stringify(didRoutingRecords)),
      createValidationContent('DbhOverflowRouting', sortedRouting?.reduce((acc, curr) => acc + '-' + curr.Scenario, 'DBHRouting--'), didRoutingRecords.reduce((acc, curr) => acc + '-' + curr.Scenario, 'DBHRouting--')),
      createValidationContent('DbhOverflowNumber', sortedRouting?.reduce((acc, curr) => acc + '-' + curr.Destination, 'DBHNumber--'), didRoutingRecords.reduce((acc, curr) => acc + '-' + curr.Destination, 'DBHNumber--')),
      createValidationContent('AbhOverflowRouting', sortedRouting?.reduce((acc, curr) => acc + '-' + curr.Scenario, 'ABHRouting--'), didRoutingRecords.reduce((acc, curr) => acc + '-' + curr.Scenario, 'ABHRouting--')),
      createValidationContent('AbhOverflowNumber', sortedRouting?.reduce((acc, curr) => acc + '-' + curr.Destination, 'ABHNumber--'), didRoutingRecords.reduce((acc, curr) => acc + '-' + curr.Destination, 'ABHNumber--'))
    ]
  }
}
