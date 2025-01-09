// import { trace, traceAllMethods } from '../utils/trace'
import { JiraDid, JiraSubtask, LmDidV1Structure, LmDidV2Structure, LmIvrNameToPathId, UpdateDevPlanRequest } from '../types'
import * as fileService from './fileService'
import * as jiraService from './jiraService'
import * as utilityService from './utilityService'
import dotenv from 'dotenv'
import fs from 'fs/promises'

dotenv.config()

const IVR_PARAMETERS_TR_URL = process.env.IVR_PARAMETERS_TR_URL as string
const ADDITIONAL_IVR_PARAMETERS_TR_URL = process.env.ADDITIONAL_IVR_PARAMETERS_TR_URL as string
const AFTER_HOURS_ROUTING_TR_URL = process.env.AFTER_HOURS_ROUTING_TR_URL as string
const AGENT_UNAVAILABLE_PARAMETERS_TR_URL = process.env.AGENT_UNAVAILABLE_PARAMETERS_TR_URL as string
const AGENT_UNAVAILABLE_ROUTING_TR_URL = process.env.AGENT_UNAVAILABLE_ROUTING_TR_URL as string
const ROUTING_OPTIONS_BY_TFN_TR_URL = process.env.ROUTING_OPTIONS_BY_TFN_TR_URL as string
const AFID_BY_TFN_TR_URL = process.env.AFID_BY_TFN_TR_URL as string
const IVR_DIDS_TR_URL = process.env.IVR_DIDS_TR_URL as string
const IVR_DID_ROUTING_TR_URL = process.env.IVR_DID_ROUTING_TR_URL as string
const BASE_DIRECTORY = 'src/data/configFiles/cuyConfigFiles/'

// To show traces if we want to debug code deeper, also might need to wrap any method with trace(...)
// const tracedUtilityService = traceAllMethods(utilityService, 'utilityService')
// const tracedJiraService = traceAllMethods(jiraService, 'jiraService')

const TABLE_HEADERS = {
  ivrParameters: ['TFN', 'Environment', 'Active', 'Campaign', 'NumDescription', 'SubCampaign', 'MainGreeting', 'MenuOptions', 'MenuGreeting', 'MenuOptionsRepeatCounter', 'ACDRoutingType', 'AgentExtRouting', 'AgentExtDnis', 'ZipAttempts', 'ExtensionAttempts', 'HoldMsg', 'CheckSuspectANI', 'CheckOutOfFootprint', 'AlternateRoutingPath'],
  additionalIvrParameters: ['TFN', 'InvalidMenuSelectionMessage', 'ExtensionPrompt', 'InvalidExtensionPrompt', 'RepeatExtensionPrompt', 'ZipPrompt', 'InvalidZipPrompt', 'RepeatZipPrompt', 'SubMenuGreeting', 'SubMenuOptions', 'SubMenuOptionsRepeatCounter', 'InvalidSubMenuSelectionMessage', 'CheckAgentAvailability', 'CheckHoursOfOperation', 'DisconnectMSG', 'OutOfFootprintMessage', 'SoaInboundCheck'],
  afterHoursRouting: ['TFN', 'Order', 'OverflowDestination', 'Number', 'DestinationCampaign', 'DestinationSkill'],
  agentUnavailableParameters: ['TFN', 'AgentUnavailableRoutingType', 'AgentUnavailableMessage', 'AfterHoursRoutingType', 'GroupClosedMessage'],
  agentUnavailableRouting: ['TFN', 'Order', 'OverflowDestination', 'Number', 'DestinationCampaign', 'DestinationSkill'],
  routingOptions: ['TFN', 'RoutingPath', 'RoutingOption', 'RoutingAction', 'RoutingValue', 'RoutingPrompt', 'RoutingStatus', 'Description'],
  ivrDid: ['DID', 'PathID', 'PathCode', 'Environment', 'Campaign', 'Active', 'CheckSuspectANI', 'NumDescription', 'SoaInboundCheck'],
  ivrDidRouting: ['DID', 'Environment', 'Scenario', 'Destination'],
  afid: ['Priority', 'Description', 'Campaign', 'Afid', 'Cid', 'Tfn'],
  subCampaign: ['To be created dynamically'],
  leadType: ['To be created dynamically']
}

const NO_RECORDS_FOUND_MESSAGE = 'No records found for this table rule\n'
const NO_DIDS_TO_CONFIGURE_MESSAGE = 'There are no DIDs to configure'

const createDynamicTableHeader = (fields: string[]): string => {
  if (fields.length === 0) return 'Error fetching fields'
  let header = ''
  fields.forEach(field => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    header += `||${field}`
  })
  return `${header}||\n`
}

const createFinalTable = (attribute: string[], content: string): string => {
  return (content !== '') ? createDynamicTableHeader(attribute) + content : NO_RECORDS_FOUND_MESSAGE
}

const createTable = (configurationMapping: Map<string, any>, attribute: string): string => {
  let table = ''
  const tableHeaders = TABLE_HEADERS[attribute as keyof typeof TABLE_HEADERS]
  for (const [, didConfigStructure] of configurationMapping) {
    const tableStructure = didConfigStructure[attribute]
    if (Array.isArray(tableStructure)) {
      tableStructure.forEach((option: any) => { table = createTableRow(option, table, tableHeaders) })
    } else {
      table = createTableRow(tableStructure, table, tableHeaders)
    }
  }
  return (table !== '') ? createDynamicTableHeader(tableHeaders) + table : NO_RECORDS_FOUND_MESSAGE
}

const createTableRow = (structure: any, content: string, tableHeaders: string[]): string => {
  if (structure === undefined || structure === null) return content
  for (const header of tableHeaders) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (typeof structure[header] === 'boolean') {
      const booleanString = structure[header] as boolean
      content += `|${booleanString ? 'TRUE' : 'FALSE'}`
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      content += `|${structure[header]}`
    }
  }
  content += '|\n'
  return content
}

export const generateV1IvrConfigDevPlan = async (jiraCardNumber: string): Promise<string> => {
  const [jiraCard, jiraDids, lmStructureMappingArray] = await utilityService.resolvePromises([jiraService.getJiraCardByNumber(jiraCardNumber), jiraService.getJiraCardDids(jiraCardNumber), fileService.getLmIvr()])
  const v1Dids = jiraDids
    .filter((did: JiraDid) => utilityService.isV1Campaign(did.campaign))
    .sort((a: JiraDid, b: JiraDid) => a.campaign > b.campaign ? 1 : -1)
  if (v1Dids.length === 0) return `${NO_DIDS_TO_CONFIGURE_MESSAGE} for version 1 campaigns`
  const description = await generateV1IvrConfigDevPlanDescription(v1Dids, lmStructureMappingArray)
  return await jiraService.handleDevTaskCreation(jiraCard, description, '[DEV - LM IVR-CONFIG] Did configuration for v1 campaign numbers')
}

const generateV1IvrConfigDevPlanDescription = async (dids: JiraDid[], lmStructureMappingArray: LmIvrNameToPathId[]): Promise<string> => {
  const configurationMapping = new Map<string, LmDidV1Structure | undefined>()
  for (const jiraDid of dids) {
    configurationMapping.set(jiraDid.did, utilityService.getDidStructure(jiraDid, lmStructureMappingArray).lmStructure as LmDidV1Structure | undefined)
  }
  const [
    ivrParametersTable,
    additionalIvrParametersTable,
    afterHoursRoutingTable,
    agentUnavailableParametersTable,
    agentUnavailableRoutingTable,
    routingOptionsTable
  ] = [
    createTable(configurationMapping, 'ivrParameters'),
    createTable(configurationMapping, 'additionalIvrParameters'),
    createTable(configurationMapping, 'afterHoursRouting'),
    createTable(configurationMapping, 'agentUnavailableParameters'),
    createTable(configurationMapping, 'agentUnavailableRouting'),
    createTable(configurationMapping, 'routingOptions')
  ]
  return `
  *IVR-CONFIG*
   * [[Genesys] IVR Parameters|${IVR_PARAMETERS_TR_URL}]\n${ivrParametersTable}
   * [[Genesys] Additional IVR Parameters|${ADDITIONAL_IVR_PARAMETERS_TR_URL}]\n${additionalIvrParametersTable}
   * [[Genesys] After Hours Routing|${AFTER_HOURS_ROUTING_TR_URL}]\n${afterHoursRoutingTable}
   * [[Genesys] Agent Unavailable Parameters|${AGENT_UNAVAILABLE_PARAMETERS_TR_URL}]\n${agentUnavailableParametersTable}
   * [[Genesys] Agent Unavailable Routing|${AGENT_UNAVAILABLE_ROUTING_TR_URL}]\n${agentUnavailableRoutingTable}
   * [[Genesys] Routing Options By TFN|${ROUTING_OPTIONS_BY_TFN_TR_URL}]\n${routingOptionsTable}
  `
}

export const generateV2IvrConfigDevPlan = async (jiraCardNumber: string): Promise<string> => {
  const [jiraCard, jiraDids, lmStructureMappingArray] = await utilityService.resolvePromises([jiraService.getJiraCardByNumber(jiraCardNumber), jiraService.getJiraCardDids(jiraCardNumber), fileService.getLmIvr()])
  const v2Dids = jiraDids
    .filter((did: JiraDid) => !utilityService.isV1Campaign(did.campaign))
    .sort((a: JiraDid, b: JiraDid) => a.campaign > b.campaign ? 1 : -1)
  if (v2Dids.length === 0) return `${NO_DIDS_TO_CONFIGURE_MESSAGE} for version 2 campaigns`
  const description = await generateV2IvrConfigDevPlanDescription(v2Dids, lmStructureMappingArray)
  return await jiraService.handleDevTaskCreation(jiraCard, description, '[DEV - LM IVR-CONFIG] Did configuration for v2 campaign numbers')
}

const generateV2IvrConfigDevPlanDescription = async (dids: JiraDid[], lmStructureMappingArray: LmIvrNameToPathId[]): Promise<string> => {
  const configurationMapping = new Map<string, LmDidV2Structure | undefined>()
  for (const jiraDid of dids) {
    configurationMapping.set(jiraDid.did, utilityService.getDidStructure(jiraDid, lmStructureMappingArray).lmStructure as LmDidV2Structure | undefined)
  }
  const [
    ivrDidsTable,
    ivrDidRoutingTable
  ] = [
    createTable(configurationMapping, 'ivrDid'),
    createTable(configurationMapping, 'ivrDidRouting')
  ]
  return `
  *IVR-CONFIG*
   * [[Flow PROD] IVR DIDs|${IVR_DIDS_TR_URL}]\n${ivrDidsTable}
   * [[Flow PROD] IVR DID Routing|${IVR_DID_ROUTING_TR_URL}]\n${ivrDidRoutingTable}
  `
}

export const generateCuyDevPlan = async (jiraCardNumber: string): Promise<string> => {
  const [jiraCard, jiraDids, lmStructureMappingArray] = await utilityService.resolvePromises([jiraService.getJiraCardByNumber(jiraCardNumber), jiraService.getJiraCardDids(jiraCardNumber), fileService.getLmIvr()])
  if (jiraDids.length === 0) return `${NO_DIDS_TO_CONFIGURE_MESSAGE} for marketing tables`
  const description = await generateCuyDevPlanDescription(jiraDids, lmStructureMappingArray)
  return await jiraService.handleDevTaskCreation(jiraCard, description, '[DEV - LM CUY] Did configuration for AFIDs, OBSkills and LeadTypes')
}

const generateCuyDevPlanDescription = async (dids: JiraDid[], lmStructureMappingArray: LmIvrNameToPathId[]): Promise<string> => {
  const configurationMapping = new Map<string, any>()
  dids.forEach(jiraDid => {
    configurationMapping.set(jiraDid.did, utilityService.getDidStructure(jiraDid, lmStructureMappingArray).cuyStructure)
  })
  return `
  *CUY*
   * [[Populate Inbound] Afid by Tfn|${AFID_BY_TFN_TR_URL}]
  ${createTable(configurationMapping, 'afid')}
  ${createMarketingTables(dids, lmStructureMappingArray)}
  `
}

const createMarketingTables = (dids: JiraDid[], lmStructureMappingArray: LmIvrNameToPathId[]): string => {
  const campaignMapping = mapDidsByCampaign(dids)
  const campaignConfigurations = Array.from(campaignMapping.entries()).map(([campaignName, didsByCampaign]) => {
    const configurationMapping = new Map<string, any>()
    didsByCampaign.forEach(jiraDid => {
      configurationMapping.set(jiraDid.did, utilityService.getDidStructure(jiraDid, lmStructureMappingArray).cuyStructure)
    })
    const firstConfig = configurationMapping.values().next().value
    return `
     *CUY-${campaignName}*
     ${generateCampaignDetailsBystructure(JSON.stringify(firstConfig), true, configurationMapping)}
     `
  })
  return campaignConfigurations.join('')
}

export const generateDevPlan = async (jiraCardNumber: string): Promise<any> => {
  try {
    const [v1Message, v2Message, cuyMessage, riMessage] = await utilityService.resolvePromises([generateV1IvrConfigDevPlan(jiraCardNumber), generateV2IvrConfigDevPlan(jiraCardNumber), generateCuyDevPlan(jiraCardNumber), generateJiraReleaseIntructions(jiraCardNumber)])
    return `${v1Message as string} ${v2Message as string} ${cuyMessage as string} ${riMessage as string}`
  } catch (error: any) {
    throw new Error(error)
  }
}

// export const generateDevPlanByCampaign = trace(async (jiraCardNumber: string): Promise<any> => {
//   const [jiraCard, jiraDids] = await utilityService.resolvePromises([jiraService.getJiraCardByNumber(jiraCardNumber), jiraService.getJiraCardDids(jiraCardNumber)])
//   const [didDescriptionMapping, jiraSubtasks] = await utilityService.resolvePromises([mapDescriptionByCampaign(jiraDids), jiraService.getJiraSubtasks(jiraCardNumber)])
//   const devTaskPromises = []
//   let message = ''
//   for (const [campaignName, description] of didDescriptionMapping) {
//     const title = `[DEV - LM IVR-CONFIG] Did configuration for ${campaignName as string}`
//     const existingSubtask = (jiraSubtasks as JiraSubtask[]).find(subtask => subtask.fields.summary === title)
//     if (existingSubtask === undefined) {
//       devTaskPromises.push(jiraService.createSingleDevTask(jiraCard, description, title))
//       message += `${title} => CREATED SUCCESSFULLY\n`
//     } else {
//       devTaskPromises.push(jiraService.updateSingleDevTask(existingSubtask.key, description))
//       message += `${title} => UPDATED SUCCESSFULLY\n`
//     }
//   }
//   await utilityService.resolvePromises(devTaskPromises)
//   return message
// }, 'generateDevPlanByCampaign')

export const generateDevPlanByCampaign = async (jiraCardNumber: string): Promise<any> => {
  const [jiraCard, jiraDids] = await utilityService.resolvePromises([jiraService.getJiraCardByNumber(jiraCardNumber), jiraService.getJiraCardDids(jiraCardNumber)])
  const [didDescriptionMapping, jiraSubtasks] = await utilityService.resolvePromises([mapDescriptionByCampaign(jiraDids), jiraService.getJiraSubtasks(jiraCardNumber)])
  const devTaskPromises = []
  let message = ''
  for (const [campaignName, description] of didDescriptionMapping) {
    const title = `[DEV - LM IVR-CONFIG] Did configuration for ${campaignName as string}`
    const existingSubtask = (jiraSubtasks as JiraSubtask[]).find(subtask => subtask.fields.summary === title)
    if (existingSubtask === undefined) {
      devTaskPromises.push(jiraService.createSingleDevTask(jiraCard, description, title))
      message += `${title} => CREATED SUCCESSFULLY\n`
    } else {
      devTaskPromises.push(jiraService.updateSingleDevTask(existingSubtask.key, description))
      message += `${title} => UPDATED SUCCESSFULLY\n`
    }
  }
  await utilityService.resolvePromises(devTaskPromises)
  return message
}

export const updateDevPlanByCampaign = async (jiraCardNumber: string, devPlanRequest: UpdateDevPlanRequest): Promise<any> => {
  const jiraDids: JiraDid[] = await jiraService.getJiraCardDids(jiraCardNumber)
  const didsToUpdate = utilityService.filterDidsByCampaign(jiraDids, devPlanRequest.campaign)
  const descriptionToUpdate = await mapDescriptionByCampaign(didsToUpdate)
  for (const [, description] of descriptionToUpdate) {
    await jiraService.updateSingleDevTask(devPlanRequest.subtaskCardNumber, description)
  }
  return `DEV PLAN FOR ${devPlanRequest.campaign} UPDATED SUCCESSFULLY`
}

export const mapDescriptionByCampaign = async (dids: JiraDid[]): Promise<Map<string, string>> => {
  const campaignMapping = new Map<string, JiraDid[]>()
  dids.forEach(did => {
    const array = campaignMapping.get(did.campaign) ?? []
    array.push(did)
    campaignMapping.set(did.campaign, array)
  })
  const descriptionMapping = new Map<string, string>()
  const lmStructureMappingArray: LmIvrNameToPathId[] = await fileService.getLmIvr()
  for (const [campaignName, didsByCampaign] of campaignMapping) {
    try {
      const dynamicStructure = await fs.readFile(BASE_DIRECTORY + (campaignName) + '.json', { encoding: 'utf8' })
      const description = generateJiraDevPlanDescriptionByCampaign(didsByCampaign, campaignName, lmStructureMappingArray, dynamicStructure)
      descriptionMapping.set(campaignName, description)
    } catch (error) {
      const noFoundData = await fs.readFile(BASE_DIRECTORY + 'CUY_NOT_FOUND.json', { encoding: 'utf8' })
      const description = generateJiraDevPlanDescriptionByCampaign(didsByCampaign, campaignName, lmStructureMappingArray, noFoundData)
      descriptionMapping.set(campaignName, description)
    }
  }
  return descriptionMapping
}

export const generateJiraDevPlanDescriptionByCampaign = (dids: JiraDid[], campaignName: string, lmStructureMappingArray: LmIvrNameToPathId[], dynamicStructure: string): string => {
  let [ivrParametersTable, additionalIvrParametersTable, afterHoursRoutingTable, agentUnavailableParametersTable, agentUnavailableRoutingTable, routingOptionsTable] = ['', '', '', '', '', '']
  let [ivrDidsTable, ivrDidRoutingTable] = ['', '']
  let afidTable = ''
  let campaignTables = ''
  const dynamicConfigurationMapping = new Map<string, any>()
  for (const jiraDid of dids) {
    const didStructure = utilityService.getDidStructure(jiraDid, lmStructureMappingArray)
    const cuyStructure = utilityService.getDidStructure(jiraDid, lmStructureMappingArray).cuyStructure
    if (didStructure?.lmStructure === undefined || didStructure?.lmStructure === null) {
      const errorMessage = `The DID ${jiraDid.did} doesn't have a defined LM structure`
      return errorMessage
    } else {
      if (utilityService.isV1Campaign(campaignName)) {
        // V1 Campaign
        const lmStructure = didStructure?.lmStructure as LmDidV1Structure
        ivrParametersTable = createTableRow(lmStructure.ivrParameters, ivrParametersTable, TABLE_HEADERS.ivrParameters)
        additionalIvrParametersTable = createTableRow(lmStructure.additionalIvrParameters, additionalIvrParametersTable, TABLE_HEADERS.additionalIvrParameters)
        afterHoursRoutingTable = createTableRow(lmStructure.afterHoursRouting, afterHoursRoutingTable, TABLE_HEADERS.afterHoursRouting)
        agentUnavailableParametersTable = createTableRow(lmStructure.agentUnavailableParameters, agentUnavailableParametersTable, TABLE_HEADERS.agentUnavailableParameters)
        agentUnavailableRoutingTable = createTableRow(lmStructure.agentUnavailableRouting, agentUnavailableRoutingTable, TABLE_HEADERS.agentUnavailableRouting)
        if (lmStructure.routingOptions !== undefined && lmStructure.routingOptions !== null) {
          lmStructure.routingOptions.forEach(option => { routingOptionsTable = createTableRow(option, routingOptionsTable, TABLE_HEADERS.routingOptions) })
        }
      } else {
        // V2 Campaign
        const lmStructure = didStructure?.lmStructure as LmDidV2Structure
        ivrDidsTable = createTableRow(lmStructure.ivrDid, ivrDidsTable, TABLE_HEADERS.ivrDid)
        if (lmStructure.ivrDidRouting !== undefined && lmStructure.ivrDidRouting !== null) {
          lmStructure.ivrDidRouting.forEach(row => { ivrDidRoutingTable = createTableRow(row, ivrDidRoutingTable, TABLE_HEADERS.ivrDidRouting) })
        }
      }
    }

    if (cuyStructure === undefined || cuyStructure === null) {
      const errorMessage = `The DID ${jiraDid.did} doesn't have a defined CUY structure`
      return errorMessage
    } else {
      afidTable = createTableRow(cuyStructure.afid, afidTable, TABLE_HEADERS.afid)
      if (cuyStructure?.campaignConfig !== undefined) {
        dynamicConfigurationMapping.set(jiraDid.did, cuyStructure)
      } else {
        let subCampaignTable = ''
        let leadTypeTable = ''
        TABLE_HEADERS.subCampaign = cuyStructure.subCampaign.Fields
        TABLE_HEADERS.leadType = cuyStructure.leadType.Fields
        cuyStructure.subCampaign.Content.forEach(obSkillRow => { subCampaignTable = createTableRow(obSkillRow, subCampaignTable, TABLE_HEADERS.subCampaign) })
        cuyStructure.leadType.Content.forEach(leadTypeRow => { leadTypeTable = createTableRow(leadTypeRow, leadTypeTable, TABLE_HEADERS.leadType) })
        subCampaignTable = createFinalTable(TABLE_HEADERS.subCampaign, subCampaignTable)
        leadTypeTable = createFinalTable(TABLE_HEADERS.leadType, leadTypeTable)

        campaignTables = `
         * [[DNIS - OB] Subcampaign|${cuyStructure.subCampaign.Url}]
        ${subCampaignTable}
         * [[Lead Type]|${cuyStructure.leadType.Url}]
        ${leadTypeTable}
        `
      }
    }
  }
  campaignTables = generateCampaignDetailsBystructure(dynamicStructure, true, dynamicConfigurationMapping)
  // Add headers to the tables
  if (utilityService.isV1Campaign(campaignName)) {
    // V1 Campaign
    ivrParametersTable = createFinalTable(TABLE_HEADERS.ivrParameters, ivrParametersTable)
    additionalIvrParametersTable = createFinalTable(TABLE_HEADERS.additionalIvrParameters, additionalIvrParametersTable)
    afterHoursRoutingTable = createFinalTable(TABLE_HEADERS.afterHoursRouting, afterHoursRoutingTable)
    agentUnavailableParametersTable = createFinalTable(TABLE_HEADERS.agentUnavailableParameters, agentUnavailableParametersTable)
    agentUnavailableRoutingTable = createFinalTable(TABLE_HEADERS.agentUnavailableRouting, agentUnavailableRoutingTable)
    routingOptionsTable = createFinalTable(TABLE_HEADERS.routingOptions, routingOptionsTable)
  } else {
    // V2 Campaign
    ivrDidsTable = createFinalTable(TABLE_HEADERS.ivrDid, ivrDidsTable)
    ivrDidRoutingTable = createFinalTable(TABLE_HEADERS.ivrDidRouting, ivrDidRoutingTable)
  }
  afidTable = createFinalTable(TABLE_HEADERS.afid, afidTable)

  const fullDescription = `
  *IVR-CONFIG*
  ${utilityService.isV1Campaign(campaignName)
    ? `
   * [[Genesys] IVR Parameters|${IVR_PARAMETERS_TR_URL}]\n${ivrParametersTable}
   * [[Genesys] Additional IVR Parameters|${ADDITIONAL_IVR_PARAMETERS_TR_URL}]\n${additionalIvrParametersTable}
   * [[Genesys] After Hours Routing|${AFTER_HOURS_ROUTING_TR_URL}]\n${afterHoursRoutingTable}
   * [[Genesys] Agent Unavailable Parameters|${AGENT_UNAVAILABLE_PARAMETERS_TR_URL}]\n${agentUnavailableParametersTable}
   * [[Genesys] Agent Unavailable Routing|${AGENT_UNAVAILABLE_ROUTING_TR_URL}]\n${agentUnavailableRoutingTable}
   * [[Genesys] Routing Options By TFN|${ROUTING_OPTIONS_BY_TFN_TR_URL}]\n${routingOptionsTable}`
   : `
   * [[Flow PROD] IVR DIDs|${IVR_DIDS_TR_URL}]\n${ivrDidsTable}
   * [[Flow PROD] IVR DID Routing|${IVR_DID_ROUTING_TR_URL}]\n${ivrDidRoutingTable}
   `
  }
  *CUY*
   * [[Populate Inbound] Afid by Tfn|${AFID_BY_TFN_TR_URL}]\n${afidTable}
  
  *CUY-${campaignName}*
  ${campaignTables}
    `
  return fullDescription
}

const mapDidsByCampaign = (dids: JiraDid[]): Map<string, JiraDid[]> => {
  const campaignMapping = new Map<string, JiraDid[]>()
  dids.forEach(did => {
    const array = campaignMapping.get(did.campaign) ?? []
    array.push(did)
    campaignMapping.set(did.campaign, array)
  })
  return campaignMapping
}

const generateSingleCampaignReleaseInstructions = async (campaignName: string): Promise<string> => {
  let description = ''
  try {
    const data = await fs.readFile(BASE_DIRECTORY + (campaignName) + '.json', { encoding: 'utf8' })
    const tables = generateCampaignDetailsBystructure(data)
    description = ` *CUY - ${campaignName}*
    ${tables} 
    `
  } catch (error) {
    const noFoundData = await fs.readFile(BASE_DIRECTORY + 'CUY_NOT_FOUND.json', { encoding: 'utf8' })
    const tables = generateCampaignDetailsBystructure(noFoundData)
    description = ` *CUY - ${campaignName}*
    ${tables} 
    `
  }
  return description
}

export const generateJiraReleaseIntructions = async (jiraCardNumber: string): Promise<any> => {
  const [jiraCard, jiraDids] = await utilityService.resolvePromises([jiraService.getJiraCardByNumber(jiraCardNumber), jiraService.getJiraCardDids(jiraCardNumber)])
  if (jiraDids.length === 0) return `${NO_DIDS_TO_CONFIGURE_MESSAGE} for release instructions`
  const order = jiraDids.sort((a: JiraDid, b: JiraDid) => a.campaign > b.campaign ? 1 : -1)
  const campaigns: string[] = Array.from(mapDidsByCampaign(order).keys())
  const description = await generateJiraReleaseInstructionsDescription(campaigns)
  return await jiraService.handleDevTaskCreation(jiraCard, description, '[PROD - Genesys & LM] Release instructions')
}

export const generateJiraReleaseInstructionsDescription = async (campaignNames: string[]): Promise<string> => {
  const campaigns = []
  let v1CampaignPresent = false
  let v2CampaignPresent = false
  const v1Tables = `
   * [[Genesys] IVR Parameters|${IVR_PARAMETERS_TR_URL}]
   * [[Genesys] Additional IVR Parameters|${ADDITIONAL_IVR_PARAMETERS_TR_URL}]
   * [[Genesys] After Hours Routing|${AFTER_HOURS_ROUTING_TR_URL}]
   * [[Genesys] Agent Unavailable Parameters|${AGENT_UNAVAILABLE_PARAMETERS_TR_URL}]
   * [[Genesys] Agent Unavailable Routing|${AGENT_UNAVAILABLE_ROUTING_TR_URL}]
   * [[Genesys] Routing Options By TFN|${ROUTING_OPTIONS_BY_TFN_TR_URL}]
  `
  const v2Tables = `
   * [[Flow PROD] IVR DIDs|${IVR_DIDS_TR_URL}]
   * [[Flow PROD] IVR DID Routing|${IVR_DID_ROUTING_TR_URL}]
  `

  const v1DAGconfig = `{code:json}{
  "lm_env": "PROD",
  "genesys_env": "PROD",
  "target_tables": "Config"\n}{code}`

  const v2DAGconfig = `{code:json}{
  "lm_env": "PROD",
  "genesys_env": "PROD",
  "target_tables": "FlowPROD"\n}{code}`

  for (const campaignName of campaignNames) {
    if (!v1CampaignPresent) { v1CampaignPresent = utilityService.isV1Campaign(campaignName) }
    if (!v2CampaignPresent) { v2CampaignPresent = !utilityService.isV1Campaign(campaignName) }
    campaigns.push(await generateSingleCampaignReleaseInstructions(campaignName))
  }

  const description = `
  {color:#de350b}*Check if there are not any full deployment or content deploy for the following tables then:*{color}
  
  *IVR-CONFIG*

  *1. Perform content deployment to PROD for IVR-CONFIG table rules:*\n
    ${v1CampaignPresent ? `*Model 1 tables:*${v1Tables}` : ''}
    ${v2CampaignPresent ? `*Model 2 tables:*${v2Tables}` : ''}

  *2. Run the DAG on Airflow PROD*
     * [https://airflow.intergies.com/home?tags=AIR-85]
     {color:#de350b}*using the following configuration*{color}
     ${v1CampaignPresent ? v1DAGconfig : ''}
     ${v2CampaignPresent ? v2DAGconfig : ''}

  *3. Perform a deploy on Genesys-CxaC using octopus*
   * [latest release version|https://octopusdeploy.cignium.com/app#/Spaces-1/projects/genesys-cxac/deployments]

  {color:#de350b}*Check if there are not any full deployment or content deploy for the following tables then:*{color}

  *CUY* 
   * [[Populate Inbound] Afid by Tfn|${AFID_BY_TFN_TR_URL}]

  ${campaigns.join('')}
  `
  return description
}

const generateCampaignDetailsBystructure = (data: string, getLMTable: boolean = false, didMapping: Map<string, any> = new Map()): string => {
  const structured = JSON.parse(data)
  const details: string[] = []
  structured.campaignConfig.forEach((element: Record<string, any>) => {
    const tableName: string = element.Name
    const tableUrl: string = element.Url
    const title: string = ` * [${tableName}|${tableUrl}]`
    let table = ''
    if (getLMTable) {
      TABLE_HEADERS[element.id as keyof typeof TABLE_HEADERS] = element.Fields as string[]
      const configurationMapping = new Map<string, any>()
      for (const [key, obj] of didMapping) {
        const structure: Record<string, any> = {}
        const campaignConfigItem = obj.campaignConfig.find((value: any) => value.id === element.id)
        structure[element.id] = campaignConfigItem.Content
        configurationMapping.set(key, structure)
      }
      table = createTable(configurationMapping, element.id)
    }
    const finalDescription = `${title}\n${table}\n`
    details.push(finalDescription)
  })

  return details.join('')
}
