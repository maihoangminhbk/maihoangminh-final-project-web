import axios from 'axios'
import { API_ROOT } from 'utilities/constants'


const API = axios.create({ baseURL: API_ROOT })

API.interceptors.request.use((req) => {
  if (localStorage.getItem('currentUser')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
  }

  return req
})

export const createBoard = async (data) => {
  const request = await API.post('/v1/boards', data)

  return request.data
}

export const updateBoard = async (id, data) => {
  const request = await API.put(`/v1/boards/${id}`, data)

  return request.data
}

export const fetchBoardDetails = async (id) => {
  const request = await API.get(`/v1/boards/${id}`)

  return request.data
}

export const createColumn = async (data) => {
  const request = await API.post('/v1/columns', data)

  return request.data
}

// Update or remove column
export const updateColumn = async (id, data) => {
  const request = await API.put(`/v1/columns/${id}`, data)

  return request.data
}

// Update or remove column
export const updateCard = async (id, data) => {
  const request = await API.put(`/v1/cards/${id}`, data)

  return request.data
}

export const createNewCard = async (data) => {
  const request = await API.post('/v1/cards', data)

  return request.data
}

// Login and signup
export const login = async (data) => {
  const request = await API.post('/v1/users/login', data)
  return request.data
}

export const signup = async (data) => {
  const request = await API.post('/v1/users/signup', data)

  return request.data
}

// Create and get workplace
export const createWorkplace = async (data) => {
  const request = await API.post('/v1/workplaces', data)

  return request.data
}

export const getWorkplace = async (id) => {
  const request = await API.get(`/v1/workplaces/${id}`)

  return request.data
}

// Create and get ownership
export const createOwnership = async () => {
  const request = await API.post('/v1/ownership')

  return request.data
}

export const getOwnership = async () => {
  const request = await API.get('/v1/ownership')

  return request.data
}
