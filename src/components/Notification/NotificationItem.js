import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dropdown, Container, Row, Col } from 'react-bootstrap'
import { format } from 'date-fns'

import { getCardIdFromTask } from 'actions/APICall'

import './NotificationItem.scss'
import minhMaiAvatar from 'actions/images/userAvatar.png'


import { data, grammar } from './data'

function NotificationItem ({ data, onDropdownShow }) {
  const notificationTime = format(data.createdAt, 'MMMM d, yyyy h:mm aa')

  const { workplaceId } = useParams()

  const navigate = useNavigate()

  const onClickItem = async () => {
    onDropdownShow(false)
    let path = `workplaces/${workplaceId}/boards/${data.boardId}`
    if (data.objectTargetType === 'card') {
      path = path + `/card/${data.objectTargetId}`
    }

    if (data.objectTargetType === 'task') {
      const cardId = await getCardIdFromTask(data.objectTargetId)
      if (cardId) {
        path = path + `/card/${cardId}`
      }
    }
    navigate(path)
  }

  return (
    <Dropdown.Item className='notification-item' onClick={onClickItem}>
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