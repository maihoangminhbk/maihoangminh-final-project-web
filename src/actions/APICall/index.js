import axios from 'axios'
import { API_ROOT, CHATBOT_API_ROOT } from 'utilities/constants'
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

export const searchUsersToAddBoard = async (id, data) => {
  const request = await API.post(`/v1/boards/${id}/search-users-to-add`, data)

  return request.data
}

export const searchUsersInBoard = async (id, data) => {
  const request = await API.post(`/v1/boards/${id}/search-users`, data)

  return request.data
}

export const addUserToBoard = async (id, data) => {
  const request = await API.post(`/v1/boards/${id}/add-user`, data)

  return request.data
}

export const deleteUserFromBoard = async (id, data) => {
  const request = await API.post(`/v1/boards/${id}/delete-user`, data)

  return request.data
}

export const updateUserFromBoard = async (id, data) => {
  const request = await API.post(`/v1/boards/${id}/update-user`, data)

  return request.data
}

export const getUserListInBoard = async (id) => {
  const request = await API.get(`/v1/boards/${id}/users`)

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

// Get card
export const getCard = async (id) => {
  const request = await API.get(`/v1/cards/${id}`)

  return request.data
}

// Get card calendar
export const getCalendarCards = async (data) => {
  const request = await API.post('/v1/cards/get-calendar-cards', data)

  return request.data
}


// Update or remove column
export const updateCard = async (id, data) => {
  const request = await API.put(`/v1/cards/${id}`, data)

  return request.data
}

export const uploadCardImage = async (id, formData, onUploadProgress) => {
  const request = await API.post(`/v1/cards/${id}/image/upload`, formData, onUploadProgress)

  console.log('request - uploadCardImage', request)

  return request.data
}

export const createNewCard = async (data) => {
  const request = await API.post('/v1/cards', data)

  return request.data
}

export const searchUsersToAddCard = async (id, data) => {
  const request = await API.post(`/v1/cards/${id}/search-users-to-add`, data)

  return request.data
}

export const searchUsersInCard = async (id, data) => {
  const request = await API.post(`/v1/cards/${id}/search-users`, data)

  return request.data
}

export const addUserToCard = async (id, data) => {
  const request = await API.post(`/v1/cards/${id}/add-user`, data)

  return request.data
}

export const deleteUserFromCard = async (id, data) => {
  const request = await API.post(`/v1/cards/${id}/delete-user`, data)

  return request.data
}

// Task API
export const createNewTask = async (data) => {
  const request = await API.post('/v1/tasks', data)

  return request.data
}

export const updateTask = async (id, data) => {
  const request = await API.put(`/v1/tasks/${id}`, data)

  return request.data
}

export const searchUsersToAddTask = async (id, data) => {
  const request = await API.post(`/v1/tasks/${id}/search-users-to-add`, data)

  return request.data
}

export const searchUsersInTask = async (id, data) => {
  const request = await API.post(`/v1/tasks/${id}/search-users`, data)

  return request.data
}

export const addUserToTask = async (id, data) => {
  const request = await API.post(`/v1/tasks/${id}/add-user`, data)

  return request.data
}

export const deleteUserFromTask = async (id, data) => {
  const request = await API.post(`/v1/tasks/${id}/delete-user`, data)

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

export const updateWorkplace = async (id, data) => {
  const request = await API.put(`/v1/workplaces/${id}`, data)

  return request.data
}

export const searchUsersInWorkplace = async (id, data) => {
  const request = await API.post(`/v1/workplaces/${id}/search-users`, data)

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


export const addUserToWorkplace = async (id, data) => {
  const request = await API.post(`/v1/workplaces/${id}/add-user`, data)

  return request.data
}

export const getUserListInWorkplace = async (id) => {
  const request = await API.get(`/v1/workplaces/${id}/users`)

  return request.data
}

export const addBoardToWorkplace = async (id, data) => {
  const request = await API.post(`/v1/workplaces/${id}/add-board`, data)

  return request.data
}

export const getSlackAuth = async (data) => {
  const request = await API.post('/v1/slack/auth', data)

  return request.data
}

export const getSlackWorkspace = async (data) => {
  const request = await API.post('/v1/slack/get-workspace', data)

  return request.data
}

export const getSlackConnections = async (data) => {
  const request = await API.post('/v1/slack/get-connections', data)

  return request.data
}

export const getSlackChannels = async (data) => {
  const request = await API.post('/v1/slack/get-channels', data)

  return request.data
}

export const createSlackConnection = async (data) => {
  const request = await API.post('/v1/slack/create-connection', data)

  return request.data
}

export const updateSlackConnection = async (data) => {
  const request = await API.post('/v1/slack/update-connection', data)

  return request.data
}

export const dashboardGetCardsStatusFullStatistic = async (id) => {
  const request = await API.get(`/v1/dashboard/${id}/get-cards-status-full-statistic`)

  return request.data
}

export const dashboardGetTasksStatusFullStatistic = async (id) => {
  const request = await API.get(`/v1/dashboard/${id}/get-tasks-status-full-statistic`)

  return request.data
}

export const dashboardGetCardsStatusStatistic = async (id, startTime, endTime) => {
  const request = await API.get(`/v1/dashboard/${id}/get-cards-status-statistic?startTime=${startTime}&endTime=${endTime}`)

  return request.data
}

export const dashboardGetTasksStatusStatistic = async (id, startTime, endTime) => {
  const request = await API.get(`/v1/dashboard/${id}/get-tasks-status-statistic?startTime=${startTime}&endTime=${endTime}`)

  return request.data
}

export const dashboardGetWorkplaceStatistic = async (id) => {
  const request = await API.get(`/v1/dashboard/${id}/get-workplace-statistic`)

  return request.data
}

export const dashboardGetBoardStatistic = async (id) => {
  const request = await API.get(`/v1/dashboard/${id}/get-board-statistic`)

  return request.data
}

export const dashboardGetWorkplaceUserCountStatistic = async (id) => {
  const request = await API.get(`/v1/dashboard/${id}/get-workplace-users-count-statistic`)

  return request.data
}

export const dashboardGetTasksStatusInYearStatistic = async (id, year) => {
  const request = await API.get(`/v1/dashboard/${id}/get-tasks-status-in-year-statistic?year=${year}`)

  return request.data
}

export const dashboardGetUsersInfoStatistic = async (id, keyword, page) => {
  const request = await API.get(`/v1/dashboard/${id}/get-users-info-statistic?keyword=${keyword}&page=${page}`)

  return request.data
}

export const getPersonalNotifications = async (id, page) => {
  const request = await API.get(`v1/notifications/${id}/get-personal-notifications?page=${page}`)

  return request.data
}

export const getFollowingNotifications = async (id, page) => {
  const request = await API.get(`v1/notifications/${id}/get-following-notifications?page=${page}`)

  return request.data
}


const CHATBOT_API = axios.create({ baseURL: CHATBOT_API_ROOT })

export const chatbot = async (data) => {
  const request = await CHATBOT_API.post('/webhooks/rest/webhook', data)

  return request.data
}


