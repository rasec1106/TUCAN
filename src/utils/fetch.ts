import axios from 'axios'
import { buildUrl } from './urlBuilder'

export const fetch = async (url: string) => {
  return axios.request({ method: 'get', url })
}

export const fetchWithToken = async (url: string, token: string) => {
  return axios.request({
    method: 'get',
    url,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
}

export const postWithToken = async (url: string, data: any, token: string) => {
  return axios.request({
    method: 'post',
    url,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data,
  })
}

export const putWithToken = async (url: string, data: any, token: string) => {
  return axios.request({
    method: 'put',
    url,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data,
  })
}

export const fetchData = async <T>(urlTemplate: string, replacements: Record<string, string>): Promise<T> => {
  const url = buildUrl(urlTemplate, replacements)
  const response = await fetch(url)
  return response.data as T
}
