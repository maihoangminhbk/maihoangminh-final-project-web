import React from 'react'

import App from 'App'
import ErrorPage from 'components/ErrorPage/ErrorPage'
import Auth from 'components/Auth/Auth'
import BoardBar from 'components/BoardBar/BoardBar'
import ProtectedRoute from 'components/ProtectRoute/ProtectRoute'
import AppBar from 'components/AppBar/AppBar'

import { createBrowserRouter } from 'react-router-dom'
import BoardContent from 'components/BoardContent/BoardContent'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      // { index: true, element: <Index /> },
      {
        path: 'auth',
        element: <Auth />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'workplaces/:workplaceId',
            element: <><AppBar /><BoardBar /></>,
            children: [
              {
                path: 'boards/:boardId',
                element: <BoardContent />
              }
            ]
          }
        ]
      }
    ]
  }
])

export default router