import { DidConfigStructure, JiraDid, LmAdditionalIvrParametersV1, LmAfterHoursRoutingV1, LmAgentUnavailableParametersV1, LmAgentUnavailableRoutingV1, LmDidV1, LmIvrNameToPathId, LmIvrParametersV1, LmRoutingOptionsByTfnV1 } from '../types'
import * as lmService from './lmService'

/**
 * Parses the DIDs from Jira card description.
 * @param rawDescription The card's description in Jira with ONE SINGLE table, no multiple tables supported at the moment.
 * @param tableHeadersMapping Mapping for table headers.
 * @param tableContentMapping Mapping for table content.
 * @returns An array of JiraDid objects.
 */
export function getDidsFromJiraCardDescription (rawDescription: string, tableHeadersMapping: Map<string, string>, tableContentMapping: Map<string, string>): JiraDid[] {
  const lines = rawDescription.split('\n')
  const dids: JiraDid[] = []
  let headersArray: string[] = []

  let tableHeaderFound = false
  for (const line of lines) {
    if (line.startsWith('|')) {
      // At the moment of spliting we get '' and '\r' as elements in the array, we need to filter them
      const didRow = cleanDidRow(line)
      // First row of the table must be the headers
      if (!tableHeaderFound) {
        tableHeaderFound = true
        headersArray = didRow
        headersArray.forEach(header => {
          if (!tableHeadersMapping.has(header)) {
            throw new Error(`Error: Header mapping not found for: ${header}`)
          }
        })
      } else {
        // Create the did from the row and push it into the array
        const did: any = {}
        didRow.forEach((val, index) => {
          const key = tableHeadersMapping.get(headersArray[index]) as string
          const campaignKey = did.campaign as string
          const ibSkillKey = did.ibSkill as string
          // Eliminate unnecessary blank spaces
          val = val.trim()
          // Transform the content if mapped
          let value = tableContentMapping.get(key + campaignKey + ibSkillKey + val)
          if (value === undefined) value = tableContentMapping.get(key + campaignKey + '*' + val) // ibSkill wildcard
          if (value === undefined) value = tableContentMapping.get(key + '**' + val) // campaign + ibSkill wildcard
          // eslint-disable-next-line @typescript-eslint/dot-notation
          did[key] = (value === undefined) ? val : value
        })
        dids.push(did)
      }
    }
  }
  return dids
}

export function cleanDidRow (line: string): string[] {
  return line.split('|').map(value => {
    // Clean up color formatting
    value = value.replace(/\{color:[^}]+\}(.*?)\{color\}/g, '$1')
    // Clean up bold formatting
    value = value.replace(/\*(?=\S)|(?<=\S)\*|(?<=\S)\*(?=\S)/g, '')
    // Clean up strike formatting
    value = value.replace(/^-(?=.*-(?!.*-))|(?<=\S)-(?!\S)/g, '')
    // Clean up superscript formatting
    value = value.replace(/\^(?=\S)|(?<=\S)\^|(?<=\S)\^(?=\S)/g, '')
    // Clean up underscript formatting
    value = value.replace(/~(?=\S)|(?<=\S)~|(?<=\S)~(?=\S)/g, '')
    // Clean up citation formatting
    value = value.replace(/\?\?(?=\S)|(?<=\S)\?\?|(?<=\S)\?\?(?=\S)/g, '')
    // Clean up monospace formatting
    value = value.replace(/\{\{(?=\S)|(?<=\S)\}\}/g, '')
    // Clean up italic formatting
    value = value.replace(/(^_|_$)|(?<=\s)_|_(?=\s)/g, '')
    // Clean up underline formatting
    value = value.replace(/(?<=\s)\+|(?<=\S)\+/g, '')
    return value
  }).filter(value => {
    // Clean up special characters and eliminates unnecessary blank spaces
    value = value.replace(/[^a-zA-Z0-9*]/g, '').trim()
    return value !== ''
  })
}

/**
 * Partitions an array of JiraDid by version.
 * @param array The array of JiraDid objects.
 * @returns A tuple of two arrays: V1 and V2 DIDs.
 */
export function partitionArrayByVersion (array: JiraDid[]): [JiraDid[], JiraDid[]] {
  const v1Numbers = array.filter(did => isV1Campaign(did.campaign))
  const v2Numbers = array.filter(did => !isV1Campaign(did.campaign))
  return [v1Numbers, v2Numbers]
}

/**
 * Filters an array of JiraDid by campaign name.
 * @param array The array of JiraDid objects.
 * @param campaignName The campaign name to filter by.
 * @returns A filtered array of JiraDid.
 */
export function filterDidsByCampaign (array: JiraDid[], campaignName: string): JiraDid[] {
  return array.filter(did => did.campaign.toUpperCase() === campaignName.toUpperCase())
}

/**
 * Checks if a campaign is a V1 campaign.
 * @param campaignName The campaign name.
 * @returns True if the campaign is V1, otherwise false.
 */
export function isV1Campaign (campaignName: string): boolean {
  return ['AFLC', 'AFQL', 'AMA', 'COL', 'COLS', 'CPQL', 'ELVC', 'HMA', 'MAQL', 'MLF', 'MLFQ', 'MLFS', 'MLQL', 'MMS', 'MSQL', 'PDP', 'QLF'].includes(campaignName.toUpperCase())
}

/**
 * Builds V1 DIDs from LM tables.
 * @returns A promise that resolves to an array of LmDidV1.
 */
export async function buildV1DidsFromLmTables (): Promise<LmDidV1[]> {
  try {
    const [
      ivrParameters,
      additionalIvrParameters,
      afterHoursRouting,
      agentUnavailableParameters,
      agentUnavailableRouting,
      routingOptions
    ] = await resolvePromises([
      lmService.getV1IvrParameters(),
      lmService.getV1AdditionalIvrParameters(),
      lmService.getV1AfterHoursRouting(),
      lmService.getV1AgentUnavailableParameters(),
      lmService.getV1AgentUnavailableRouting(),
      lmService.getV1RoutingOptionsByTfn()
    ])

    return (ivrParameters as LmIvrParametersV1[]).map(did => (
      {
        DID: did.TFN,
        NumDescription: did.NumDescription,
        Campaign: did.Campaign,
        ivrParameters: did,
        additionalIvrParameters: (additionalIvrParameters as LmAdditionalIvrParametersV1[]).find(e => e.TFN === did.TFN),
        afterHoursRouting: (afterHoursRouting as LmAfterHoursRoutingV1[]).find(e => e.TFN === did.TFN),
        agentUnavailableParameters: (agentUnavailableParameters as LmAgentUnavailableParametersV1[]).find(e => e.TFN === did.TFN),
        agentUnavailableRouting: (agentUnavailableRouting as LmAgentUnavailableRoutingV1[]).find(e => e.TFN === did.TFN),
        routingOptions: (routingOptions as LmRoutingOptionsByTfnV1[]).filter(e => e.TFN === did.TFN)
      }
    )) as LmDidV1[]
  } catch (error) {
    throw new Error('Failed to build V1 DIDs')
  }
}

/**
 * Gets the DID structure from a JiraDid and LM structure mapping.
 * @param jiraDid The JiraDid object.
 * @param lmStructureMappingArray The array of LM structure mappings.
 * @returns The DidConfigStructure or undefined if no match is found.
 */
export function getDidStructure (jiraDid: JiraDid, lmStructureMappingArray: LmIvrNameToPathId[]): DidConfigStructure {
  // Exact match
  let pathIdRecord = lmStructureMappingArray.find(lmRecord =>
    (lmRecord.campaign.toUpperCase() === jiraDid.campaign.toUpperCase()) &&
    (lmRecord.jiraIvr.toUpperCase() === jiraDid.ivr.toUpperCase()) &&
    (lmRecord.greeting.toUpperCase() === jiraDid.greeting.toUpperCase()) &&
    (lmRecord.skill.toUpperCase() === jiraDid.ibSkill.toUpperCase()) &&
    (lmRecord.dbhRouting.toUpperCase() === jiraDid.dbhRouting.toUpperCase()) &&
    (lmRecord.abhRouting.toUpperCase() === jiraDid.abhRouting.toUpperCase())
  )
  // AbhRouting wildcard
  if (pathIdRecord === undefined) {
    pathIdRecord = lmStructureMappingArray.find(lmRecord =>
      (lmRecord.campaign.toUpperCase() === jiraDid.campaign.toUpperCase()) &&
      (lmRecord.jiraIvr.toUpperCase() === jiraDid.ivr.toUpperCase()) &&
      (lmRecord.greeting.toUpperCase() === jiraDid.greeting.toUpperCase()) &&
      (lmRecord.skill.toUpperCase() === jiraDid.ibSkill.toUpperCase()) &&
      (lmRecord.dbhRouting.toUpperCase() === jiraDid.dbhRouting.toUpperCase()) &&
      (lmRecord.abhRouting.toUpperCase() === jiraDid.abhRouting.toUpperCase() || lmRecord.abhRouting.toUpperCase() === '*')
    )
  }
  // DbhRouting + AbhRouting wildcard
  if (pathIdRecord === undefined) {
    pathIdRecord = lmStructureMappingArray.find(lmRecord =>
      (lmRecord.campaign.toUpperCase() === jiraDid.campaign.toUpperCase()) &&
      (lmRecord.jiraIvr.toUpperCase() === jiraDid.ivr.toUpperCase()) &&
      (lmRecord.greeting.toUpperCase() === jiraDid.greeting.toUpperCase()) &&
      (lmRecord.skill.toUpperCase() === jiraDid.ibSkill.toUpperCase()) &&
      (lmRecord.dbhRouting.toUpperCase() === jiraDid.dbhRouting.toUpperCase() || lmRecord.dbhRouting.toUpperCase() === '*') &&
      (lmRecord.abhRouting.toUpperCase() === jiraDid.abhRouting.toUpperCase() || lmRecord.abhRouting.toUpperCase() === '*')
    )
  }
  // IbSkill + DbhRouting + AbhRouting wildcard
  if (pathIdRecord === undefined) {
    pathIdRecord = lmStructureMappingArray.find(lmRecord =>
      (lmRecord.campaign.toUpperCase() === jiraDid.campaign.toUpperCase()) &&
      (lmRecord.jiraIvr.toUpperCase() === jiraDid.ivr.toUpperCase()) &&
      (lmRecord.greeting.toUpperCase() === jiraDid.greeting.toUpperCase()) &&
      (lmRecord.skill.toUpperCase() === jiraDid.ibSkill.toUpperCase() || lmRecord.skill.toUpperCase() === '*') &&
      (lmRecord.dbhRouting.toUpperCase() === jiraDid.dbhRouting.toUpperCase() || lmRecord.dbhRouting.toUpperCase() === '*') &&
      (lmRecord.abhRouting.toUpperCase() === jiraDid.abhRouting.toUpperCase() || lmRecord.abhRouting.toUpperCase() === '*')
    )
  }
  // Greeting + IbSkill + DbhRouting + AbhRouting wildcard
  if (pathIdRecord === undefined) {
    pathIdRecord = lmStructureMappingArray.find(lmRecord =>
      (lmRecord.campaign.toUpperCase() === jiraDid.campaign.toUpperCase()) &&
      (lmRecord.jiraIvr.toUpperCase() === jiraDid.ivr.toUpperCase()) &&
      (lmRecord.greeting.toUpperCase() === jiraDid.greeting.toUpperCase() || lmRecord.greeting.toUpperCase() === '*') &&
      (lmRecord.skill.toUpperCase() === jiraDid.ibSkill.toUpperCase() || lmRecord.skill.toUpperCase() === '*') &&
      (lmRecord.dbhRouting.toUpperCase() === jiraDid.dbhRouting.toUpperCase() || lmRecord.dbhRouting.toUpperCase() === '*') &&
      (lmRecord.abhRouting.toUpperCase() === jiraDid.abhRouting.toUpperCase() || lmRecord.abhRouting.toUpperCase() === '*')
    )
  }
  // Not found
  if (pathIdRecord === undefined) {
    pathIdRecord = lmStructureMappingArray.find(lmRecord =>
      (lmRecord.campaign.toUpperCase() === jiraDid.campaign.toUpperCase()) &&
      (lmRecord.jiraIvr.toUpperCase() === '?') &&
      (lmRecord.greeting.toUpperCase() === '?') &&
      (lmRecord.skill.toUpperCase() === '?') &&
      (lmRecord.dbhRouting.toUpperCase() === '?') &&
      (lmRecord.abhRouting.toUpperCase() === '?')
    )
  }
  if (pathIdRecord === undefined) {
    pathIdRecord = lmStructureMappingArray.find(lmRecord =>
      (lmRecord.campaign.toUpperCase() === '?') &&
      (lmRecord.jiraIvr.toUpperCase() === '?') &&
      (lmRecord.greeting.toUpperCase() === '?') &&
      (lmRecord.skill.toUpperCase() === '?') &&
      (lmRecord.dbhRouting.toUpperCase() === '?') &&
      (lmRecord.abhRouting.toUpperCase() === '?')
    )
  }
  // Replace placeholders with actual values
  if (pathIdRecord !== undefined) {
    let rawJson = JSON.stringify(pathIdRecord)
    rawJson = rawJson.replace(/{TFN:string}/g, jiraDid.did)
    rawJson = rawJson.replace(/{Campaign:string}/g, jiraDid.campaign)
    rawJson = rawJson.replace(/{NumDescription:string}/g, jiraDid.description)
    rawJson = rawJson.replace(/{IbSkill:string}/g, jiraDid.ibSkill)
    rawJson = rawJson.replace(/{AbhNumber:string}/g, jiraDid.abhOverflow)
    rawJson = rawJson.replace(/{DbhNumber:string}/g, jiraDid.dbhOverflow)
    rawJson = rawJson.replace(/{Afid:string}/g, jiraDid.afid)
    rawJson = rawJson.replace(/{LeadType:string}/g, jiraDid.leadType)
    rawJson = rawJson.replace(/{ObSkill:string}/g, jiraDid.obSkill)
    pathIdRecord = JSON.parse(rawJson)
  }
  return {
    lmStructure: pathIdRecord?.lmStructure,
    cuyStructure: pathIdRecord?.cuyStructure
  }
}

/**
 * Resolves promises to fetch required data.
 * @returns A promise that resolves to an array of promises.
 */
export async function resolvePromises (promiseArray: Array<Promise<any>>): Promise<any[]> {
  try {
    return await Promise.all(promiseArray)
  } catch (error) {
    const errorMessage = `${(error as Error).message}`
    throw new Error(errorMessage)
  }
}
