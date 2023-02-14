import React, { useState, useEffect } from 'react'
import Switch from 'react-switch'
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent
} from 'react-pro-sidebar'
import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart, FaAlignJustify, FaRegCalendarCheck, FaTable, FaNetworkWired, FaUserAlt, FaRocketchat, FaWhmcs, FaAngleDoubleLeft } from 'react-icons/fa'
import './Aside.scss'
import { getOwnership, getWorkplace } from 'actions/APICall'
import { useAuth } from 'hooks/useAuth'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import UserListAvatar from 'components/User/UserListAvatar'

const Aside = ({ toggled, handleToggleSidebar, getBoardList }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [workplace, setWorkplace] = useState({})
  const [boardList, setBoardList] = useState([])
  const { user } = useAuth()
  const { workplaceId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const result = getOwnershipData()
    console.log(result)

  }, [])

  const getOwnershipData = async () => {
    console.log('aside - getOwnership - workplaceId', workplaceId)
    const workplaceResult = await getWorkplace(workplaceId)
    console.log('aside - useEffect - workplaceResult', workplaceResult)
    setBoardList(workplaceResult.boardOrder)
    console.log('aside - useEffect - result', workplaceResult.boardOrder)
    setWorkplace(workplaceResult)
    getBoardList(workplaceResult.boardOrder)
  }
  const handleCollapsedChange = () => {
    setCollapsed(!collapsed)
  }

  const boardListInsert = () => {
    // console.log('aside - boardListInsert - boardList', boardList)

    const menuItems = boardList.map((board, index) => {
      console.log('aside - boardListInsert - board, index', board, index)
      return <MenuItem onClick={() => changeBoard(board.boardId)} key={index}>{board.title}</MenuItem>
    })

    return (
      menuItems
    )
    // return (<MenuItem>Board 2</MenuItem>)
  }

  const mindmapListInsert = () => {
    // console.log('aside - boardListInsert - boardList', boardList)

    const menuItems = boardList.map((board, index) => {
      console.log('aside - mindmapListInsert - board, index', board.boardId, index)
      return <MenuItem onClick={() => changeMindMap(board.boardId)} key={index}>{board.title}</MenuItem>
    })

    return (
      menuItems
    )
    // return (<MenuItem>Board 2</MenuItem>)
  }

  const changeBoard = (boardId) => {
    console.log('aside - changeBoard - location', location)
    navigate(`boards/${boardId}`)
  }

  const changeUsers = () => {
    navigate('users')
  }

  const changeCalendar = () => {
    navigate('calendar')
  }

  const changeMindMap = (mindmapId) => {
    console.log('mindmapId', mindmapId)
    navigate(`mindmaps/${mindmapId}`)
  }

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader onClick={handleCollapsedChange}>
        <div className='aside-bar-header-icon'>
          {!collapsed? '': <FaAlignJustify/>}
          <strong>{(collapsed && workplace.title)? '': workplace.title}</strong>
          {(collapsed && workplace.title)? '': <FaAngleDoubleLeft style={ { marginLeft: '30px' } }/>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow"></span>}
            title={'Boards'}
            icon={<FaTable />}
          >
            {
              boardListInsert()
            }
            {/* <MenuItem>Board 1</MenuItem>
            <MenuItem>Board 2</MenuItem>
            <MenuItem>Board 3</MenuItem> */}
          </SubMenu>

          <SubMenu
            // suffix={<span className="badge red">{'inprocess'}</span>}
            title={'MindMap'}
            icon={<FaNetworkWired />}
            // onClick={changeMindMap}
          >

            {
              mindmapListInsert()
            }

          </SubMenu>
        </Menu>

        <Menu iconShape="circle">
          <MenuItem
            icon={<FaRegCalendarCheck />}
            // suffix={<span className="badge red">{'inprocess'}</span>}
            onClick={changeCalendar}
          >
            {'Calendar'}
          </MenuItem>
        </Menu>

        <Menu iconShape="circle">
          <MenuItem
            icon={<FaUserAlt />}
            suffix={!collapsed ? <UserListAvatar /> : ''}
            onClick={changeUsers}
          >
            {'User'}
          </MenuItem>
          <MenuItem
            icon={<FaRocketchat />}
            suffix={<span className="badge red">{'inprocess'}</span>}
          >
            {'Chat'}</MenuItem>
        </Menu>

        <Menu iconShape="circle">
          <MenuItem
            icon={<FaWhmcs />}
            suffix={<span className="badge red">{'inprocess'}</span>}
          >
            {'Setting'}
          </MenuItem>
        </Menu>

      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px'
          }}
        >
          <a
            href="https://github.com/maihoangminhbk"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            </span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  )
}

export default Aside
