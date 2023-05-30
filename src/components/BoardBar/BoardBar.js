import React, { useEffect, useState } from 'react'
import './BoardBar.scss'
import Aside from 'components/Aside/Aside'
// import 'react-pro-sidebar/dist/css/styles.css'
import BoardContent from 'components/BoardContent/BoardContent'

import { useAuth } from 'hooks/useAuth'
import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import ChatIcon from 'components/Chat/ChatIcon'

function BoardBar() {
  const [toggled, setToggled] = useState(false)
  const [boardList, setBoardList] = useState([])

  const workplaceId = useParams()
  // const { setBoard } = useOutletContext()

  const handleToggleSidebar = (value) => {
    setToggled(value)
  }

  const getBoardList = (boardList) => {
    setBoardList(boardList)
  }

  return (
    <div className={`navbar-board ${toggled ? 'toggled' : ''}`}>
      <Aside
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
        getBoardList={getBoardList}
        // setBoard={setBoard}
      />
      <ChatIcon />
      {/* <Main
        toggled={toggled}
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      /> */}
      {/* <BoardContent
        handleToggleSidebar={handleToggleSidebar}
        boardId={boardList[0]? boardList[0].boardId : ''}
      /> */}
      <Outlet context={handleToggleSidebar}/>
    </div>
  )
  // return (
  // <></>
  // <nav className='navbar-board'> Board Bar</nav>
  // <ProSidebar>
  //   <Menu iconShape="square">
  //     <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
  //     <SubMenu title="Components" icon={<FaHeart />}>
  //       <MenuItem>Component 1</MenuItem>
  //       <MenuItem>Component 2</MenuItem>
  //     </SubMenu>
  //   </Menu>
  // </ProSidebar>
  // )
}

export default BoardBar