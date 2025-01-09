interface JiraCardContent {
  description: string
  subtasks: JiraSubtask[]
  project: {
    id: number
  }
}
export interface JiraSubtask {
  key: string
  fields: {
    summary: string
  }
}
export interface JiraCard {
  expand: string
  id: string
  self: string
  key: string
  fields: JiraCardContent
}
export interface JiraDid {
  afid: string
  campaign: string
  did: string
  description: string
  ivr: string
  greeting: string
  ibSkill: string
  obSkill: string
  dbhRouting: string
  dbhOverflow: string
  abhRouting: string
  abhOverflow: string
  leadType: string
}
export interface LmIvrParametersV1 {
  TFN: string
  Environment: string
  Active: boolean
  Campaign: string
  NumDescription: string
  SubCampaign: string
  MainGreeting: string
  MenuOptions: number
  MenuGreeting: string
  MenuOptionsRepeatCounter: number
  ACDRoutingType: string
  AgentExtRouting: string
  AgentExtDnis: string
  ZipAttempts: number
  ExtensionAttempts: number
  HoldMsg: string
  CheckSuspectANI: boolean
  CheckOutOfFootprint: boolean
  AlternateRoutingPath: string
}
export interface LmAdditionalIvrParametersV1 {
  TFN: string
  InvalidMenuSelectionMessage: string
  ExtensionPrompt: string
  InvalidExtensionPrompt: string
  RepeatExtensionPrompt: string
  ZipPrompt: string
  InvalidZipPrompt: string
  RepeatZipPrompt: string
  SubMenuGreeting: string
  SubMenuOptions: number
  SubMenuOptionsRepeatCounter: number
  InvalidSubMenuSelectionMessage: string
  CheckAgentAvailability: boolean
  CheckHoursOfOperation: boolean
  DisconnectMSG: string
  OutOfFootprintMessage: string
  SoaInboundCheck: boolean
}
export interface LmAfterHoursRoutingV1 {
  TFN: string
  Order: string
  OverflowDestination: string
  Number: string
  DestinationCampaign: string
  DestinationSkill: string
}
export interface LmAgentUnavailableParametersV1 {
  TFN: string
  AgentUnavailableRoutingType: string
  AgentUnavailableMessage: string
  AfterHoursRoutingType: string
  GroupClosedMessage: string
}
export interface LmAgentUnavailableRoutingV1 {
  TFN: string
  Order: string
  OverflowDestination: string
  Number: string
  DestinationCampaign: string
  DestinationSkill: string
}
export interface LmRoutingOptionsByTfnV1 {
  TFN: string
  RoutingPath: string
  RoutingOption: number
  RoutingAction: string
  RoutingValue: string
  RoutingPrompt: string
  RoutingStatus: string
  Description: string
}
export interface LmDidV1Structure {
  ivrParameters: LmIvrParametersV1 | undefined
  additionalIvrParameters: LmAdditionalIvrParametersV1 | undefined
  afterHoursRouting: LmAfterHoursRoutingV1 | undefined
  agentUnavailableParameters: LmAgentUnavailableParametersV1 | undefined
  agentUnavailableRouting: LmAgentUnavailableRoutingV1 | undefined
  routingOptions: LmRoutingOptionsByTfnV1[] | undefined
}
export interface LmDidV1 {
  DID: string
  Campaign: string
  NumDescription: string
  ivrParameters: LmIvrParametersV1 | undefined
  additionalIvrParameters: LmAdditionalIvrParametersV1 | undefined
  afterHoursRouting: LmAfterHoursRoutingV1 | undefined
  agentUnavailableParameters: LmAgentUnavailableParametersV1 | undefined
  agentUnavailableRouting: LmAgentUnavailableRoutingV1 | undefined
  routingOptions: LmRoutingOptionsByTfnV1[] | undefined
}
export interface LmIvrDidV2 {
  DID: string
  PathID: string
  PathCode: string
  Environment: string
  Campaign: string
  Active: boolean
  CheckSuspectANI: boolean
  NumDescription: string
  SoaInboundCheck: boolean
}
export interface LmIvrDidRoutingV2 {
  DID: string
  Environment: string
  Scenario: string
  Destination: string
}
export interface LmDidV2Structure {
  ivrDid: LmIvrDidV2 | undefined
  ivrDidRouting: LmIvrDidRoutingV2[] | undefined
}
export interface DidConfigStructure {
  lmStructure: LmDidV1Structure | LmDidV2Structure | undefined
  cuyStructure: CuyStructure | undefined
}
export interface LmDidV2 {
  PathID: string
  DID: string
  Campaign: string
  NumDescription: string
  Active: boolean
  Environment: string
  PathCode: string
  CheckSuspectANI: boolean
  SoaInboundCheck: boolean
}
export interface LmDidRoutingV2 {
  Destination: string
  Environment: string
  DID: string
  Scenario: string
}
export interface JiraHeader {
  tableHeader: string
  attribute: string
}
export interface JiraContentMapping {
  attribute: string
  jiraContent: string
  campaign: string
  ibSkill: string
  lmContent: string
}
export interface LmIvrNameToPathId {
  greeting: string
  skill: string
  jiraIvr: string
  campaign: string
  dbhRouting: string
  abhRouting: string
  lmStructure: LmDidV1Structure | LmDidV2Structure
  cuyStructure: CuyStructure
}
export interface CuyStructure {
  afid: AfidStructure
  subCampaign: {
    Url: string
    Fields: string[]
    Content: SubCampaignStructure[]
  }
  leadType: {
    Url: string
    Fields: string[]
    Content: LeadTypeStructure[]
  }
  campaignConfig: [
    {
      Url: string
      Fields: string[]
      Content: any[]
      Name: string
      id: string
    }
  ]
}
export interface AfidStructure {
  Priority: number
  Description: string
  Campaign: string
  Afid: string
  Cid: string
  Tfn: string
}
export interface SubCampaignStructure {
  Priority: number
  RecalculateReason: string
  Description: string
  Did: string
  Tier: string
  CID: string
  Cid: string
  SID: string
  AFID: string
  Afid: string
  CreateReason: string
  SubCampaign: string
}
export interface LeadTypeStructure {
  Priority: number
  Did: string
  Cid: string
  Afid: string
  Campaign: string
  CreateReason: string
  LeadType: string
  IsModelB: boolean
  ElvcScriptType: string
  ZipCode: string
  Brand: string
}
export interface LmIvrNameToPathIdV2 {
  greeting: string
  skill: string
  jiraIvr: string
  campaign: string
  pathCode: string
  pathId: string
}
export interface ValidationResponse {
  isValid: boolean
  nonValidElements: ValidationElement[]
  validation: ValidationElement[]
}
export interface ValidationElement {
  isValid: boolean
  did: string
  content: ValidationContent[]
}
export interface ValidationContent {
  isValid: boolean
  attribute: string
  jiraDid: string
  lmDid: string
}
export interface LmAfid {
  Afid: string | null
}
export interface LmLeadType {
  LeadType: string | null
}
export interface LmObSubcampaign {
  SubCampaign: string | null
}
export interface LmLeadTypeUrl {
  campaign: string
  leadtypeurl: string
}
export interface LmObSubcampaignUrl {
  campaign: string
  obsubcampaignurl: string
}
export interface UpdateDevPlanRequest {
  campaign: string
  subtaskCardNumber: string
}
