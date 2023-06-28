import React, { useEffect, useState } from 'react'
import { Dropdown, Container, Row, Col } from 'react-bootstrap'
import './NotificationItem.scss'
import minhMaiAvatar from 'actions/images/userAvatar.png'



import { data, grammar } from './data'

function NotificationItem ({ data }) {
  return (
    <Dropdown.Item className='notification-item'>
      <Container className='item-container'>
        <Row>
          <Col sm={3} className='item-avatar'>
          <img src={data.userCreateAvatar ? data.userCreateAvatar : minhMaiAvatar} />
          </Col>
          <Col sm={9} className='item-content'>

            <Row className='content-text'>
              {
                grammar(data)
              }
            </Row>
            <Row className='content-time'>
                        Time
            </Row>

          </Col>
        </Row>
      </Container>
    </Dropdown.Item>

  )
}

export default NotificationItem