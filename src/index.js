import React, { Children } from 'react'
import ReactDOM from 'react-dom'

import { RouterProvider } from 'react-router-dom'

import reportWebVitals from './reportWebVitals'

import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import { AuthProvider } from 'hooks/useAuth'
import { GoogleOAuthProvider } from '@react-oauth/google'

import router from 'routes/router/router'

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="810349711486-vsa36hqu6sfu2re4oc1vgq10830k6k1f.apps.googleusercontent.com">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
