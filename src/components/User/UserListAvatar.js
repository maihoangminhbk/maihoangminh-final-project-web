import React, { useState, useEffect } from 'react'
import './UserListAvatar.scss'
import userAvatar from 'actions/images/userAvatar.png'


function UserListAvatar (props) {
  const { avatarList, showMore } = props

  const [showList, setShowList] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (avatarList.length > 99) {
      setCount(99)
    }

    if (avatarList.length > 3) {
      setCount(avatarList.length - 3)
      const convertList = avatarList.slice(0, 3)
      setShowList(convertList)
    } else {
      setShowList(avatarList)
    }
  }, [avatarList])

  return (
    <div className="avatars">
      { !showList.length &&
        <span className="avatar">
          <img src={userAvatar} />
        </span>
      }
      { showList && showList.map((avatar, index) => (

        <span key={index} className="avatar">
          <img src={avatar ? avatar : userAvatar} />
        </span>
      ))}
      {
        count != 0 &&
        <span className="avatar bonus">
        +{ showMore ? count : '' }
        </span>
      }

    </div>


  )
}

export default UserListAvatar