import React, { useEffect, useState } from 'react'
import { Dropdown, Container, Row, Col } from 'react-bootstrap'
import { format } from 'date-fns'

import './NotificationItem.scss'
import minhMaiAvatar from 'actions/images/userAvatar.png'


import { data, grammar } from './data'

function NotificationItem ({ data }) {
  const notificationTime = format(data.createdAt, 'MMMM d, yyyy h:mm aa')
  return (
    <Dropdown.Item className='notification-item'>
      <Container className='item-container'>
        <Row>
          <Col sm={3} className='item-avatar'>
            <img src={data.userCreateAvatar ? data.userCreateAvatar : minhMaiAvatar} />
          </Col>
          <Col sm={9} className='item-content'>

            <Row className='content-text-row'>
              <span className='content-text'>
                <strong>{ data.notificationType === 'deadline' || data.notificationType === 'late' ? 'You' : data.userCreateName }</strong>
                {
                  grammar(data)
                }
              </span>

            </Row>
            <Row className='content-time'>
              { notificationTime }
            </Row>

          </Col>
        </Row>
      </Container>
    </Dropdown.Item>

  )
}

export default NotificationItem