import axios from 'axios'
import { fetch, fetchWithToken, postWithToken, putWithToken } from '../../utils/fetch'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('fetch utility functions', () => {
  const url = 'https://example.com'
  const token = 'test-token'
  const jsonBody = { key: 'value' }
  const mockResponse = { data: 'test data' }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.request.mockResolvedValue(mockResponse)
  })

  test('fetch should call axios.request with GET method and correct URL', async () => {
    const result = await fetch(url)

    expect(mockedAxios.request).toHaveBeenCalledTimes(1)
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: 'get',
      url,
      headers: undefined,
      data: undefined
    })
    expect(result).toEqual(mockResponse)
  })

  test('fetchWithToken should call axios.request with GET method, URL, and Authorization header', async () => {
    const result = await fetchWithToken(url, token)

    expect(mockedAxios.request).toHaveBeenCalledTimes(1)
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: 'get',
      url,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: undefined
    })
    expect(result).toEqual(mockResponse)
  })

  test('postWithToken should call axios.request with POST method, URL, JSON body, and Authorization header', async () => {
    const result = await postWithToken(url, jsonBody, token)

    expect(mockedAxios.request).toHaveBeenCalledTimes(1)
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: 'post',
      url,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: jsonBody
    })
    expect(result).toEqual(mockResponse)
  })

  test('putWithToken should call axios.request with PUT method, URL, JSON body, and Authorization header', async () => {
    const result = await putWithToken(url, jsonBody, token)

    expect(mockedAxios.request).toHaveBeenCalledTimes(1)
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: 'put',
      url,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: jsonBody
    })
    expect(result).toEqual(mockResponse)
  })
})
