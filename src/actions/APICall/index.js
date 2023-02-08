import axios from 'axios'
import { API_ROOT } from 'utilities/constants'
import { customErrors } from 'utilities/customErrors'

const API = axios.create({ baseURL: API_ROOT })

API.interceptors.request.use((req) => {

  const user = localStorage.getItem('user')

  if (user && JSON.parse(user)) {
    // eslint-disable-next-line quotes
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`
  }

  return req
})

API.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {

  console.log('api call - respond - error', error)
  if (error.response.status === 400) {
    // NEW:- Throw New Error
    throw new customErrors.BadRequest400Error(error.response.data)
  }

  if (error.response.status === 401) {

    // NEW:- Throw New Error
    console.log('error.response', error.response)
    if (error.response.data.token_error) {
      localStorage.removeItem('user')
      window.location.reload(false)
    }
    throw new customErrors.Unauthorized401Error(error.response.data)
  }

  if (error.response.status === 404) {
    // NEW:- Throw New Error
    throw new customErrors.NotFound404Error(error.response.data)
  }

  if (error.response.status === 409) {
    // NEW:- Throw New Error
    throw new customErrors.Conflict409Error(error.response.data)
  }

  if (error.response.status === 500) {
    // NEW:- Throw New Error
    throw new customErrors.Internal500Error(error.response.data)
  }


  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
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

export const loginWithGoogle = async (data) => {
  const request = await API.post('/v1/users/login/google', data)
  return request.data
}

export const signup = async (data) => {
  const request = await API.post('/v1/users/signup', data)

  return request.data
}

export const activate = async (data) => {
  const request = await API.post('/v1/users/activate', data)

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


