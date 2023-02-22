import React, { useCallback, useEffect, useState } from 'react'
import { Container, Row, InputGroup, FormControl, Col } from 'react-bootstrap'
import './ChatList.scss'

import { MessageList, Avatar } from 'react-chat-elements'
import { FaChevronCircleRight } from 'react-icons/fa'

// import { io } from 'socket.io-client'
// import { socketURL } from 'actions/socket/socket'

import { useAuth } from 'hooks/useAuth'

import { chatbot } from 'actions/APICall'
import { toast } from 'react-toastify'

function ChatList() {

  const [dataSource, setDataSource] = useState([
    {
      position:'left',
      type:'text',
      title:'Chatbot',
      text:'Bạn cần giúp gì ạ?',
      date: new Date()
    }
  ])
  const [message, setMessage] = useState('')

  const { user } = useAuth()

  const onMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const onSendMessage = () => {
    console.log(message)
    const sendData = {
      sender: user.email,
      message: message
    }

    const userMessage = {
      position:'right',
      type:'text',
      title:'You',
      text:'Give me a message list example !',
      date: new Date()
    }

    userMessage.text = message


    const oldMessage = [...dataSource]
    const newMessage = [...dataSource, userMessage]
    setDataSource(newMessage)

    chatbot(sendData).catch((error) => {
      setDataSource(oldMessage)
      toast.error(error.message)
    }).then((respondMessage) => {
      const botMessage = {
        position:'left',
        type:'text',
        title:'Chatbot',
        text:'Give me a message list example !',
        date: new Date()
      }

      respondMessage.map((message) => {
        botMessage.text = message.text
        setDataSource([...newMessage, botMessage])
      })


    })

    setMessage('')
    toast.success('success')

  }

  return (
    <Container className='chat-list'>
      <Row className='chat-avatar'>
        <div className='item user-avatar user-avatar-dropdown' >
          <img src={'https://avatars.githubusercontent.com/u/80540635?v=4'} />
          Bot
        </div>
      </Row>
      <Row className='message-list'>
        <MessageList
          className='message-list-content'
          lockable={false}
          toBottomHeight={'100%'}
          dataSource={dataSource}
        />
      </Row>
      <Row className='group-search'>
        <Col sm='10' className='input-search'>
          <FormControl
            placeholder='Add user to workplace'
            type='text'
            value={message}
            onChange={onMessageChange}
            onKeyDown={e => (e.key === 'Enter' && onSendMessage())}
          />
        </Col>
        <Col sm='1' className='send'>
          <FaChevronCircleRight onClick={onSendMessage} className='send-button'/>
        </Col>


      </Row>
    </Container>
  )
}

export default ChatList