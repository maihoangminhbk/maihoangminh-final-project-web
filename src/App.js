import React, { useState, useEffect } from 'react'

import './App.scss'

import { Outlet } from 'react-router-dom'

// custom component
import BoardBar from 'components/BoardBar/BoardBar'
import BoardContent from 'components/BoardContent/BoardContent'
import Auth from 'components/Auth/Auth'

function App() {

  return (
    <div className="trello-maihoangminh-master">
      <Outlet />
    </div>
  )
}

export default App
