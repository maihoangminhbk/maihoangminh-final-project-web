import React, { useState, useEffect } from 'react'

import './App.scss'

import { Outlet } from 'react-router-dom'

// custom component
import BoardBar from 'components/BoardBar/BoardBar'
import BoardContent from 'components/BoardContent/BoardContent'
import Auth from 'components/Auth/Auth'

import { ToastContainer, toast } from 'react-toastify'

function App() {

  return (
    <div className="trello-maihoangminh-master">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Outlet />
    </div>
  )
}

export default App
