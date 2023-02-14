import React from 'react'
import './UserListAvatar.scss'

function UserListAvatar () {
  return (
    <div className="avatars">
      <span className="avatar">
        <img src="https://picsum.photos/70" />
      </span>
      <span className="avatar">
        <img src="https://picsum.photos/80" />
      </span>
      <span className="avatar">
        <img src="https://picsum.photos/90" />
      </span>
      <span className="avatar">
        <img src="https://picsum.photos/100" />
      </span>
      <span className="avatar bonus">
        +9
      </span>
    </div>
  )
}

export default UserListAvatar