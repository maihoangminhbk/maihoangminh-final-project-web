import React, { useState } from 'react'

import './ChatIcon.scss'
import { FaFacebookMessenger } from 'react-icons/fa'
import ChatList from './ChatList'

function ChatIcon() {

  const [toggleChatList, setToggleChatList] = useState(false)

  return (
    <div>
      <div className='chat-icon' onClick={() => setToggleChatList(!toggleChatList)}>
        <FaFacebookMessenger className='message-icon' />
      </div>

      { toggleChatList &&
        <ChatList />
      }
    </div>
  )
}

export default ChatIcon