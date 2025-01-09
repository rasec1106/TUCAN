import { LmIvrNameToPathId } from '../../types'
import * as utilityService from '../../services/utilityService'
import fs from 'fs/promises'

const IVR_CONFIG_DEFAULT_DIRECTORY = 'src/data/configFiles/ivrConfigFiles/'
const CUY_CONFIG_DEFAULT_DIRECTORY = 'src/data/configFiles/cuyConfigFiles/'

const createIvrMapping = async (campaign: string, jiraIvr: string, greeting: string, skills: string[], dbhRouting: string, abhRouting: string, ivrConfigFilename: string, cuyConfigFilename: string): Promise<LmIvrNameToPathId[]> => {
  try {
    const [lmStructureRaw, cuyStructureRaw] = await utilityService.resolvePromises([fs.readFile(IVR_CONFIG_DEFAULT_DIRECTORY + ivrConfigFilename, { encoding: 'utf8' }), fs.readFile(CUY_CONFIG_DEFAULT_DIRECTORY + cuyConfigFilename, { encoding: 'utf8' })])
    const [lmStructure, cuyStructure] = [JSON.parse(lmStructureRaw), JSON.parse(cuyStructureRaw)]
    return skills.map(skill => ({ campaign, jiraIvr, greeting, skill, dbhRouting, abhRouting, lmStructure, cuyStructure }))
  } catch (error) {
  }
  return []
}

const buildIvrMappings = async (): Promise<LmIvrNameToPathId[]> => {
  const mappings = []
  mappings.push(
    ...(await utilityService.resolvePromises([
      // v1 campaigns
      createIvrMapping('MAQL', 'MAIN', 'N/A', ['QA11', 'QA14'], 'N/A', 'N/A', 'MAQL_ANIONLY_DEFAULT_DISCONNECT_DISCONNECT.json', 'MAQL.json'),
      createIvrMapping('MAQL', 'MAIN', 'GENERIC GREETING', ['QA11'], 'N/A', 'N/A', 'MAQL_MAIN_PARTNER_DEFAULT_DISCONNECT_VOICEMAIL.json', 'MAQL.json'),
      createIvrMapping('MAQL', 'MAIN', 'DEFAULT GREETING', ['QA11'], 'N/A', 'N/A', 'MAQL_MAIN_PARTNER_DEFAULT_DISCONNECT_VOICEMAIL.json', 'MAQL.json'),
      createIvrMapping('MAQL', 'MAQL_MAIN_IVR', 'NONE', ['QA11'], 'N/A', 'N/A', 'MAQL_ANIONLY_DEFAULT_DISCONNECT_VOICEMAIL.json', 'MAQL.json'),
      createIvrMapping('HMA', 'MAIN', 'PARTNER', ['SB15'], 'N/A', 'N/A', 'HMA_MAIN_PARTNER_DEFAULT_DISCONNECT_DISCONNECT.json', 'HMA.json'),
      createIvrMapping('HMA', 'MAIN', 'PARTNER', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'HMA_MAIN_PARTNER_DEFAULT_LIVEOPS_LIVEOPS.json', 'HMA.json'),
      createIvrMapping('HMA', 'ANIONLY', 'N/A', ['SB15'], 'N/A', 'N/A', 'HMA_ANIONLY_DEFAULT_DISCONNECT_DISCONNECT.json', 'HMA.json'),
      createIvrMapping('HMA', 'ANIONLYIVR', 'N/A', ['SB15'], 'N/A', 'N/A', 'HMA_ANIONLY_DEFAULT_DISCONNECT_DISCONNECT.json', 'HMA.json'),
      createIvrMapping('HMA', 'HMA_MAIN_IBANI', 'NONE', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'HMA_ANIONLY_DEFAULT_LIVEOPS_LIVEOPS.json', 'HMA.json'),
      createIvrMapping('AMA', 'MAIN', 'PARTNER', ['SB15'], 'N/A', 'N/A', 'AMA_MAIN_PARTNER_DEFAULT_DISCONNECT_DISCONNECT.json', 'AMA.json'),
      createIvrMapping('AMA', 'MAIN', 'PARTNER', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'AMA_MAIN_PARTNER_DEFAULT_LIVEOPS_LIVEOPS.json', 'AMA.json'),
      createIvrMapping('AMA', 'ANIONLY', 'N/A', ['SB15'], 'N/A', 'N/A', 'AMA_ANIONLY_DEFAULT_DISCONNECT_DISCONNECT.json', 'AMA.json'),
      createIvrMapping('AMA', 'ANIONLYIVR', 'N/A', ['SB15'], 'N/A', 'N/A', 'AMA_ANIONLY_DEFAULT_DISCONNECT_DISCONNECT.json', 'AMA.json'),
      createIvrMapping('AMA', 'AMA_ANIONLYIVR', 'NONE', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'AMA_ANIONLY_DEFAULT_LIVEOPS_LIVEOPS.json', 'AMA.json'),
      // v2 campaigns
      createIvrMapping('OMA', 'MAIN', 'PARTNER', ['SB14'], 'N/A', 'N/A', 'OMA_MAIN_MAPartner_SB14_DISCONNECT_DISCONNECT.json', 'OMA.json'),
      createIvrMapping('OMA', 'MAIN', 'PARTNER', ['SB14'], 'LIVEOPS', 'LIVEOPS', 'OMA_MAIN_MAPartner_SB14_LIVEOPS_LIVEOPS.json', 'OMA.json'),
      createIvrMapping('OMA', 'MAIN', 'MEDICARE ADVANTAGE', ['SB14'], 'LIVEOPS', 'LIVEOPS', 'OMA_MAIN_MedicareAdvantage_SB14_LIVEOPS_LIVEOPS.json', 'OMA.json'),
      createIvrMapping('OMA', 'ANIONLY', 'N/A', ['SB14'], 'N/A', 'N/A', 'OMA_ANIONLYIVR_SB14_DISCONNECT_DISCONNECT.json', 'OMA.json'),
      createIvrMapping('OMA', 'OMA_ANIONLYIVR', 'NONE', ['SB14'], 'LIVEOPS', 'LIVEOPS', 'OMA_ANIONLYIVR_SB14_LIVEOPS_LIVEOPS.json', 'OMA.json'),
      createIvrMapping('KPMA', 'MAIN', 'KPMA_DIRECTMAILGREETING', ['SB14'], 'N/A', 'N/A', 'KPMA_MAIN_DefaultGreeting_SB14_DISCONNECT_DISCONNECT.json', 'KPMA.json'),
      createIvrMapping('KPMA', 'MAIN', 'KPMA_DIRECTMAILGREETING', ['SB14'], 'LIVEOPS', 'LIVEOPS', 'KPMA_MAIN_DefaultGreeting_SB14_LIVEOPS_LIVEOPS.json', 'KPMA.json'),
      createIvrMapping('KPMA', 'ANIONLY', 'N/A', ['SB14'], 'N/A', 'N/A', 'KPMA_ANIONLYIVR_SB14_DISCONNECT_DISCONNECT.json', 'KPMA.json'),
      createIvrMapping('KPMA', 'KPMA_ANIONLYIVR', 'NONE', ['SB11'], 'LIVEOPS', 'LIVEOPS', 'KPMA_ANIONLYIVR_SB11_LIVEOPS_LIVEOPS.json', 'KPMA.json'),
      createIvrMapping('CMA', 'MAIN', 'PARTNER', ['SB14'], 'N/A', 'N/A', 'CMA_MAIN_Partner_SB14_DISCONNECT_DISCONNECT.json', 'CMA.json'),
      createIvrMapping('CMA', 'MAIN', 'PARTNER', ['SB14'], 'LIVEOPS', 'LIVEOPS', 'CMA_MAIN_Partner_SB14_LIVEOPS_LIVEOPS.json', 'CMA.json'),
      createIvrMapping('CMA', 'ANIONLY', 'N/A', ['SB14'], 'N/A', 'N/A', 'CMA_ANIONLYIVR_SB14_DISCONNECT_DISCONNECT.json', 'CMA.json'),
      createIvrMapping('CMA', 'CMA_ANIONLYIVR', 'NONE', ['SB14'], 'LIVEOPS', 'LIVEOPS', 'CMA_ANIONLYIVR_SB14_LIVEOPS_LIVEOPS.json', 'CMA.json'),
      createIvrMapping('ANMO', 'MAIN', 'PARTNER', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'ANMO_MKT_MAPartner_SB15_LIVEOPS_LIVEOPS.json', 'ANMO.json'),
      createIvrMapping('ANMO', 'ANIONLY', 'N/A', ['SB35'], 'LIVEOPS', 'LIVEOPS', 'ANMO_ANIONLYIVR_SB35_LIVEOPS_LIVEOPS.json', 'ANMO.json'),
      createIvrMapping('ANMA', 'MAIN', 'PARTNER', ['SB15'], 'N/A', 'N/A', 'ANMA_MKT_MAPartner_SB15_DISCONNECT_DISCONNECT.json', 'ANMA.json'),
      createIvrMapping('ANMA', 'MAIN', 'PARTNER', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'ANMA_MKT_MAPartner_SB15_LIVEOPS_LIVEOPS.json', 'ANMA.json'),
      createIvrMapping('ANMA', 'ANIONLY', 'N/A', ['SB15'], 'N/A', 'N/A', 'ANMA_ANIONLYIVR_SB15_DISCONNECT_DISCONNECT.json', 'ANMA.json'),
      createIvrMapping('ANMA', 'ANMA_ANIONLYIVR', 'NONE', ['SB15'], 'LIVEOPS', 'LIVEOPS', 'ANMA_ANIONLYIVR_SB15_LIVEOPS_LIVEOPS.json', 'ANMA.json'),
      // mapping not found
      createIvrMapping('WCMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('UHMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TZR', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TTC', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TRN', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TRMS', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TRMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TCRN', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TQEC', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TC2', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('TC1', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('SMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'SMA.json'),
      createIvrMapping('QLF', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('PRU', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'PRU.json'),
      createIvrMapping('PDP', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('OMS', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('OMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'OMA.json'),
      createIvrMapping('MSQL', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MMS', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MLQL', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MLFS', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MLFQ', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MLF', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MCSI', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('MAQL', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'MAQL.json'),
      createIvrMapping('LCM', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('KPMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'KPMA.json'),
      createIvrMapping('HMA', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'HMA.json'),
      createIvrMapping('HCM', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('ELVC', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('CPQL', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('COLS', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('COL', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('CMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CMA.json'),
      createIvrMapping('BCMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('ASUP', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('ANMO', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'ANMO.json'),
      createIvrMapping('ANMI', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('ANMG', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('ANMA', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'ANMA.json'),
      createIvrMapping('AMS', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('AMA', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'AMA.json'),
      createIvrMapping('AFQL', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('AFLC', '?', '?', ['?'], '?', '?', 'v1_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('ABPO', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json'),
      createIvrMapping('?', '?', '?', ['?'], '?', '?', 'v2_NOT_FOUND.json', 'CUY_NOT_FOUND.json')
    ])).flat()
  )
  return mappings
}

export const ivrMappings = buildIvrMappings()

export default ivrMappings
