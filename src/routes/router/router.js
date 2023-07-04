import React from 'react'
import { Navigate } from 'react-router-dom'

import App from 'App'
import ErrorPage from 'components/ErrorPage/ErrorPage'
import Auth from 'components/Auth/Auth'
import BoardBar from 'components/BoardBar/BoardBar'
import ProtectedRoute from 'components/ProtectRoute/ProtectRoute'
import AppBar from 'components/AppBar/AppBar'

import { createBrowserRouter } from 'react-router-dom'
import BoardContent from 'components/BoardContent/BoardContent'
import Profile from 'components/Profile/Profile'
import User from 'components/User/User'
import TaskCalendar from 'components/TaskCalendar/TaskCalendar'
import Task from 'components/Task/Task'
import Diagram from 'components/Diagram/Diagram'
import DashBoard from 'components/DashBoard/DashBoard'
import SlackChat from 'components/SlackChat/SlackChat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><App /></>,
    errorElement: <ErrorPage />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      // { index: true, element: <Index /> },
      {
        index: true, // <-- match on parent, i.e. "/"
        element: <Navigate to="/auth" replace /> // <-- redirect
      },
      {
        path: 'auth',
        element: <Auth />
      },
      {
        element: <><ProtectedRoute /></>,
        children: [
          {
            element: <AppBar />,
            children: [
              {
                path: 'workplaces/:workplaceId',
                element: <><BoardBar /></>,
                children: [
                  {
                    path: 'boards/:boardId',
                    element: <BoardContent />,
                    children: [
                      {
                        path: 'card/:cardId',
                        element: <Task />
                      }
                    ]
                  },
                  {
                    path: 'users',
                    element: <User />
                  },
                  {
                    path: 'calendar',
                    element: <TaskCalendar />,
                    children: [
                      {
                        path: 'card/:cardId',
                        element: <Task />
                      }
                    ]
                  },
                  {
                    path: 'dashboard',
                    element: <DashBoard />
                  },
                  {
                    path: 'mindmaps/:boardId',
                    element: <Diagram />
                  },
                  {
                    path: 'slack-chat',
                    element: <SlackChat />
                  }
                ]
              },
              {
                path: 'profile',
                element: <Profile />
              }
            ]
          }
        ]
      }
    ]
  }
])

export default router