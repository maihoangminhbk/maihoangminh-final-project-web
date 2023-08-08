import { socketBaseURL } from 'utilities/constants'

// export const boardSocket = io('http://localhost:5551/v1/board2')
export const socketURL = {
  boardSocket: `${socketBaseURL}/v1/board`,
  chatbotSocket: `${socketBaseURL}/v1/chatbot`
}
