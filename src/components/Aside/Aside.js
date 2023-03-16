import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import { createBoard, getOwnership, getWorkplace, addBoardToWorkplace } from 'actions/APICall'
import { useAuth } from 'hooks/useAuth'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import UserListAvatar from 'components/User/UserListAvatar'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

const Aside = ({ toggled, handleToggleSidebar, getBoardList }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [workplace, setWorkplace] = useState({})
  const [boardList, setBoardList] = useState([])
  const [openNewBoardForm, setOpenNewBoardForm] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const newBoardInputRef = useRef(null)

  const { user } = useAuth()
  const { workplaceId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('workplaceId', workplaceId)

  useEffect(() => {
    const result = getOwnershipData()
  }, [])

  useEffect(() => {
    if (newBoardInputRef && newBoardInputRef.current) {
      newBoardInputRef.current.focus()
      newBoardInputRef.current.select()
    }
  }, [openNewBoardForm])

  const toogleOpenNewBoardForm = () => {
    setOpenNewBoardForm(!openNewBoardForm)
  }

  const onNewBoardTitleChange = useCallback((e) => setNewBoardTitle(e.target.value), [])

  const getOwnershipData = async () => {
    const workplaceResult = await getWorkplace(workplaceId)
    setBoardList(workplaceResult.boardOrder)
    setWorkplace(workplaceResult)
    getBoardList(workplaceResult.boardOrder)
  }
  const handleCollapsedChange = () => {
    setCollapsed(!collapsed)
  }

  const boardListInsert = () => {
    const menuItems = boardList.map((board, index) => {
      return <MenuItem onClick={() => changeBoard(board.boardId)} key={index}>{board.title}</MenuItem>
    })

    return (
      menuItems
    )
    // return (<MenuItem>Board 2</MenuItem>)
  }

  const mindmapListInsert = () => {
    const menuItems = boardList.map((board, index) => {
      return <MenuItem onClick={() => changeMindMap(board.boardId)} key={index}>{board.title}</MenuItem>
    })

    return (
      menuItems
    )
    // return (<MenuItem>Board 2</MenuItem>)
  }

  const addNewBoard = () => {
    if (!newBoardTitle) {
      newBoardInputRef.current.focus()
      return
    }
    const newBoardToAdd = {
      workplaceId: workplaceId,
      title: newBoardTitle.trim()
    }


    // Call API
    addBoardToWorkplace(workplaceId, newBoardToAdd).then(workplace => {
      setBoardList(workplace.boardOrder)
      setWorkplace(workplace)
      getBoardList(workplace.boardOrder)

      console.log('newWorkplace', workplace)
      setNewBoardTitle('')
      toogleOpenNewBoardForm()
      changeBoard(workplace.boardOrder.at(-1).boardId)

    }).catch((error) => {
      setNewBoardTitle('')
      toogleOpenNewBoardForm()
      toast.error(error.message)
    })


  }

  const changeBoard = (boardId) => {
    navigate(`boards/${boardId}`)
  }

  const changeUsers = () => {
    navigate('users')
  }

  const changeCalendar = () => {
    navigate('calendar')
  }

  const changeMindMap = (mindmapId) => {
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

            {!openNewBoardForm &&

          <MenuItem className='add-new-column' onClick={toogleOpenNewBoardForm}>
            <i className='fa fa-plus icon' />Add another board
          </MenuItem>

            }

            {openNewBoardForm &&
            <MenuItem className='enter-new-column'>
              <Form.Control
                className='input-enter-new-column'
                size="sm" type="text"
                placeholder="Enter column title..."
                ref={newBoardInputRef}
                value={newBoardTitle}
                onChange={onNewBoardTitleChange}
                onKeyDown={e => (e.key === 'Enter' && addNewBoard())}
              />
              <Button variant={newBoardTitle ? 'success' : 'error'} size='sm' onClick={addNewBoard}>Add Column</Button>
              <span className='cancel-icon' onClick={toogleOpenNewBoardForm}><i className='fa fa-trash icon'></i></span>
            </MenuItem>
            }
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
