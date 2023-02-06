import React, { useState } from 'react'

import './Loading.scss'

import Spinner from 'react-bootstrap/Spinner'

function Loading () {
  return (
    <div className='loading-spin'>
      <Spinner animation='border' role='status' style={{ height: '100px', width: '100px' }}>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  )
}

export default Loading