import React from 'react'
import { Container, Row, InputGroup, FormControl, Col } from 'react-bootstrap'
import './ChatList.scss'

import { MessageList, Avatar } from 'react-chat-elements'
import { FaChevronCircleRight } from 'react-icons/fa'

function ChatList() {
  return (
    <Container className='chat-list'>
      <Row className='chat-avatar'>
        <div className='item user-avatar user-avatar-dropdown' >
          <img src={'https://avatars.githubusercontent.com/u/80540635?v=4'} />
          Minh
        </div>
      </Row>
      <Row className='message-list'>
        <MessageList
          className='message-list-content'
          lockable={false}
          toBottomHeight={'100%'}
          dataSource={[
            {
              position:'left',
              type:'text',
              title:'Kursat',
              text:'Give me a message list example !'
            },
            {
              position:'right',
              type:'text',
              title:'Emre',
              text:'That\'s all.'
            },
            {
              position:'left',
              type:'text',
              title:'Kursat',
              text:'Give me a message list example !'
            },
            {
              position:'right',
              type:'text',
              title:'Emre',
              text:'That\'s all.'
            },
            {
              position:'left',
              type:'text',
              title:'Kursat',
              text:'Give me a message list example !'
            },
            {
              position:'right',
              type:'text',
              title:'Emre',
              text:'That\'s all.'
            },
          ]}
        />
      </Row>
      <Row className='group-search'>
        <Col sm='10' className='input-search'>
          <FormControl
            placeholder='Add user to workplace'
            type='text'
            // value={userEmail}
            // onChange={onUserEmailChange}
            onKeyDown={e => (e.key === 'Enter')}
          />
        </Col>
        <Col sm='1' className='send'>
          <FaChevronCircleRight className='send-button'/>
        </Col>


      </Row>
    </Container>
  )
}

export default ChatList