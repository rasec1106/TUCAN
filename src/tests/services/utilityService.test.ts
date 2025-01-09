import { cleanDidRow } from '../../services/utilityService'

describe('utilityService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Should clear any formating from each column in the row', () => {
    const result = ['524124', '*', 'OMA', '2016951327', '2016951327 - Integriant MA * - Farmers Overflow', 'OMA_ANIONLYIVR_SB26', 'N/A', 'SB26', 'SB02', 'N/A', 'N/A', 'N/A', 'N/A', 'Unbranded']
    it('Should clear the color formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|{color:#de350b}2016951327 - Integriant MA * - Farmers* Overflow{color}|{color:#de350b}OMA_ANIONLYIVR_SB26{color}|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the bold formatting', async () => {
      const descriptionRow = '|524124|*|*OMA*|*2016951327*|*2016951327 - Integriant MA * - Farmers* Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the strike formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|-2016951327 - Integriant MA * - Farmers Overflow-|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the superscript formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|^2016951327^ - Integriant MA * - Farmers Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the undescript formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|~2016951327~ - Integriant MA * - Farmers Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the citation formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|2016951327 - ??Integriant MA?? * - Farmers Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the monospace formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|2016951327 - {{Integriant MA}} * - Farmers Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the italic formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|2016951327 - _Integriant MA_ * - Farmers Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
    it('Should clear the underline formatting', async () => {
      const descriptionRow = '|524124|*|OMA|2016951327|2016951327 - +Integriant MA+ * - Farmers Overflow|OMA_ANIONLYIVR_SB26|N/A|SB26|SB02|N/A|N/A|N/A|N/A|Unbranded|'
      const row = cleanDidRow(descriptionRow)
      expect(result).toStrictEqual(row)
    })
  })
})
