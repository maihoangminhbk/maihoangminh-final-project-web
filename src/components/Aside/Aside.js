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
import { AiOutlineDashboard } from 'react-icons/ai'
import './Aside.scss'
import { createBoard, updateBoard, getOwnership, getWorkplace, addBoardToWorkplace, updateWorkplace, getUserListInWorkplace } from 'actions/APICall'
import { useAuth } from 'hooks/useAuth'
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom'
import UserListAvatar from 'components/User/UserListAvatar'
import { Form, Button, CloseButton } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

const Aside = ({ toggled, handleToggleSidebar, getBoardList }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [workplace, setWorkplace] = useState({})
  const [boardList, setBoardList] = useState([])
  const [clickedBoard, setClickedBoard] = useState()

  const [openNewBoardForm, setOpenNewBoardForm] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [onBoardCloseButton, setOnBoardCloseButton] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
  const [deleteBoard, setDeleteBoard] = useState()
  const [userListAvatar, setUserListAvatar] = useState([])
  const newBoardInputRef = useRef(null)

  const { user } = useAuth()
  const { workplaceId, boardId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const setBoard = useOutletContext()


  useEffect(() => {
    const result = getOwnershipData()
  }, [workplaceId])

  // useEffect(() => {
  //   if (boardId) changeBoard(boardId)
  // }, [boardId])

  useEffect(() => {
    if (newBoardInputRef && newBoardInputRef.current) {
      newBoardInputRef.current.focus()
      newBoardInputRef.current.select()
    }
  }, [openNewBoardForm])

  useEffect(() => {
    getUserListInWorkplace(workplaceId).then((users) => {
      const listAvatar = users.map(user => (
        user.cover
      ))

      setUserListAvatar(listAvatar)
    }).catch((error) => {
      toast.error(error.message)
    })
  }, [workplaceId])

  const toogleOpenNewBoardForm = () => {
    setOpenNewBoardForm(!openNewBoardForm)
  }

  const onNewBoardTitleChange = useCallback((e) => setNewBoardTitle(e.target.value), [])

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      const newBoard = {
        ...deleteBoard,
        _destroy : true
      }

      const newBoardId = newBoard.boardId

      if (newBoard.boardId) delete newBoard.boardId

      // console.log('newBoard', newBoard)

      // Call API update column
      updateBoard(newBoardId, newBoard).then(updatedBoard => {
        onUpdateBoardState(updatedBoard)
      }).catch((error) => {
        toast.error(error.message)
        toogleShowConfirmModal()
      })

    }
    toogleShowConfirmModal()
  }

  const onUpdateBoardState = (newBoardToUpdate) => {

    const boardIdToUpdate = newBoardToUpdate._id

    const newUpdatedBoard = {
      ...newBoardToUpdate,
      boardId: boardIdToUpdate
    }

    if (newUpdatedBoard._id) delete newUpdatedBoard._id


    let newBoardList = [...boardList]
    const boardIndexToUpdate = newBoardList.findIndex(i => i.boardId === boardIdToUpdate)

    if (newUpdatedBoard._destroy) {
      //  Remove column
      newBoardList.splice(boardIndexToUpdate, 1)
    } else {
      //  Update column info
      newBoardList.splice(boardIndexToUpdate, 1, newUpdatedBoard)
    }

    setBoardList(newBoardList)

    // Call API Update Workplace
    updateWorkplace(workplaceId, { boardOrder: newBoardList }).catch(() => {
      setBoardList(boardList)
    }
    ).then(() => {
      toast.info('Delete board!')
    })


  }

  const getOwnershipData = async () => {
    const workplaceResult = await getWorkplace(workplaceId)
    setBoardList(workplaceResult.boardOrder)
    setWorkplace(workplaceResult)
    getBoardList(workplaceResult.boardOrder)
  }
  const handleCollapsedChange = () => {
    setCollapsed(!collapsed)
  }

  const onBoardCloseButtonClick = (board) => {
    toogleShowConfirmModal()
    setDeleteBoard(board)
  }

  const boardListInsert = () => {
    const menuItems = boardList.map((board, index) => {
      return <MenuItem
        onClick={() => changeBoard(board.boardId)}
        // onMouseEnter={() => setOnBoardCloseButton(true)}
        // onMouseLeave={() => setOnBoardCloseButton(false)}
        key={index}>
        <div className={`board-title ${clickedBoard === board.boardId ? 'clicked-board' : ''}`}>{board.title}</div>
        {/* { onBoardCloseButton && */}
        <CloseButton variant='white' className='close-button' onClick={() => onBoardCloseButtonClick(board) }></CloseButton>
        {/* } */}
      </MenuItem>
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
    setClickedBoard(boardId)
    setBoard(boardId)
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

  const changeDashBoard = () => {
    navigate('dashboard')
  }

  const changeSlackChat = () => {
    navigate('slack-chat')
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
              <Button variant={newBoardTitle ? 'success' : 'error'} size='sm' onClick={addNewBoard}>Add Board</Button>
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
            suffix={!collapsed ? <UserListAvatar avatarList={userListAvatar} showMore={true} /> : ''}
            onClick={changeUsers}
          >
            {'User'}
          </MenuItem>
          <MenuItem
            icon={<FaRocketchat />}
            // suffix={<span className="badge red">{'inprocess'}</span>}
            onClick={changeSlackChat}
          >
            {'Slack Chat'}</MenuItem>

          <MenuItem
            icon={<AiOutlineDashboard />}
            onClick={changeDashBoard}
          >
            {'DashBoard'}</MenuItem>
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
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={'<strong>Are you sure you want to remove board </strong>'}
      />
    </ProSidebar>
  )
}

export default Aside
