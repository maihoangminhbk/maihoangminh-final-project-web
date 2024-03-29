import React, { useState, useEffect, useRef } from 'react'

import { Outlet, useOutletContext, useParams, useNavigate } from 'react-router-dom'

import { Container as BootstrapContainer, Row, Col, Form, Button, Nav, Navbar, NavDropdown, Dropdown, InputGroup, FormControl } from 'react-bootstrap'
import { searchUsersInBoard, addUserToBoard, searchUsersToAddBoard, deleteUserFromBoard, updateUserFromBoard, fetchBoardDetails, getSlackConnections, getSlackWorkspace, getBoardRole } from 'actions/APICall'

import { AiFillStar, AiOutlineFilter } from 'react-icons/ai'
import { RiSlackFill, RiDeleteBin6Fill } from 'react-icons/ri'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
import Spinner from 'react-bootstrap/Spinner'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import ConfirmModal from 'components/Common/ConfirmModal'

import CustomToggle from 'components/Common/CustomToggle'
import InfiniteScroll from 'react-infinite-scroll-component'

// import Notification from 'components/Notification/Notification'

import { toast } from 'react-toastify'

import UserListAvatar from 'components/User/UserListAvatar'
import minhMaiAvatar from 'actions/images/userAvatar.png'

import './BoardNav.scss'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
// import { useAuth } from 'hooks/useAuth'

const userListInit = [
  { _id: '1',
    name: 'Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai',
    email: 'minh@gmail.com',
    cover: 'https://picsum.photos/90',
    role: 1
  },

  { _id: '2',
    name: 'Anh Mai',
    cover: 'https://picsum.photos/91',
    email: 'minh12@gmail.com',
    role: 0
  },

  { _id: '3',
    name: 'Mai Van B',
    cover: 'https://picsum.photos/92',
    email: 'anh@gmail.com',
    role: 1
  },
  { _id: '4',
    name: 'Nguyen Van A',
    cover: 'https://picsum.photos/90',
    email: 'van@gmail.com',
    role: 1
  },

  { _id: '5',
    name: 'Minh mai',
    cover: 'https://picsum.photos/91',
    email: 'toi@gmail.com',
    role: 0
  },

  { _id: '6',
    name: 'Nay day',
    cover: 'https://picsum.photos/92',
    email: 'nay@gmail.com',
    role: 1
  }
]

function BoardNav(props) {

  const { board } = props

  // const { user } = useAuth()

  const [likeBoard, setLikeBoard] = useState(false)
  const [addUserMode, setAddUserMode] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userRole, setUserRole] = useState(1)
  const [userSearchName, setUserSearchName] = useState('')
  const [userSearchEmail, setUserSearchEmail] = useState('')
  const [userListPage, setUserListPage] = useState(1)
  const [userListAvatar, setUserListAvatar] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const [items, setItems] = useState([])
  const navigate = useNavigate()

  // const [userListFilter, setUserListFilter] = useState([])
  const [userBoardList, setUserBoardList] = useState([])
  const [userSearchList, setUserSearchList] = useState([])

  const [slackChannelList, setSlackChannelList] = useState([])
  const [slackWorkspace, setSlackWorkspace] = useState()

  const [showAddUserConfirmModal, setShowAddUserConfirmModal] = useState(false)
  const toogleShowAddUserConfirmModal = () => setShowAddUserConfirmModal(!showAddUserConfirmModal)

  const [showDeleteUserConfirmModal, setShowDeleteUserConfirmModal] = useState(false)
  const toogleShowDeleteUserConfirmModal = () => setShowDeleteUserConfirmModal(!showDeleteUserConfirmModal)

  const [showUpdateUserConfirmModal, setShowUpdateUserConfirmModal] = useState(false)
  const toogleShowUpdateUserConfirmModal = () => setShowUpdateUserConfirmModal(!showUpdateUserConfirmModal)

  const [displayOptions, setDisplayOptions] = useState({
    showImage: true,
    showStatus: true,
    showDeadline: true
  })

  const { workplaceId, boardId } = useParams()

  const [boardRole, setBoardRole] = useState(1)

  // useEffect(() => {
  //   console.log('userList', userList)
  //   console.log('userSearch', userSearch)
  //   if (!userList) return
  //   if (!userSearch) {
  //     setUserListFilter(userList)
  //   } else {
  //     const usersFilter = userList.filter(user => (user.name.includes(userSearch) || user.email.includes(userSearch)))
  //     setUserListFilter(usersFilter)
  //   }
  // }, [userList, userSearch])

  useEffect(() => {
    setUserListPage(1)

    if (addUserMode) {
      const searchData = {
        keyword: userSearch,
        page: 1
      }
      searchUsersToAddBoard(boardId, searchData).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        setUserSearchList(result)

      })
    } else {
      const searchData = {
        keyword: userSearch,
        page: 1
      }
      searchUsersInBoard(boardId, searchData).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        setUserBoardList(result)
      }
      )}
  }, [userSearch, boardId, addUserMode])

  useEffect(() => {
    const searchData = {
      keyword: '',
      page: 1
    }
    searchUsersInBoard(boardId, searchData).then(result => {
      const listAvatar = result.map(user => (
        user.cover
      ))
      setUserListAvatar(listAvatar)
    }
    )

    getBoardRole(boardId).then(result => {
      setBoardRole(result.role)
    })
  }, [boardId])

  useEffect(() => {

    if (!boardId) return

    fetchBoardDetails(boardId).then(board => {
      // console.log('board', board)
      // setBoard(board)
      let itemList = []

      board.columns.map(column => {
        column.cards.map(card => {
          const cardWithId = {
            ...card,
            id: card._id,
            boardName: 'Current Board'
          }
          itemList.push(cardWithId)
        })
      })
      setItems(itemList)
    })
  }, [boardId])

  useEffect(() => {
    props.setDisplayOptions(displayOptions)
  }, [displayOptions, props])

  useEffect(() => {
    const data = {
      workplaceId: workplaceId
    }

    getSlackConnections(data).then(slackConnections => {
      const boardSlackConnection = slackConnections.filter(connection => connection.boardId === boardId)

      setSlackChannelList(boardSlackConnection)
    })
  }, [boardId, workplaceId])

  useEffect(() => {
    if (workplaceId) {
      const data = {
        workplaceId: workplaceId
      }

      getSlackWorkspace(data).then(workspace => {
        if (workspace) {
          setSlackWorkspace(workspace)
        }
      })
    }
  }, [workplaceId])

  const fetchMoreUserData = () => {
    if (addUserMode) {
      const searchData = {
        keyword: userSearch,
        page: userListPage + 1
      }


      searchUsersToAddBoard(boardId, searchData).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
          const newUserSearchList = [
            ...userSearchList,
            ...result
          ]
          setUserSearchList(newUserSearchList)
          setUserListPage(userListPage + 1)
        }

      })
    } else {
      const searchData = {
        keyword: userSearch,
        page: userListPage + 1
      }


      searchUsersInBoard(boardId, searchData).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
          const newUserBoardList = [
            ...userBoardList,
            ...result
          ]
          // console.log('newUserSearchList', newUserBoardList)
          setUserBoardList(newUserBoardList)
          setUserListPage(userListPage + 1)
        }

      })
    }
  }


  const onLikeBoard = () => {
    setLikeBoard(!likeBoard)
  }

  const onAddUserButton = () => {
    setAddUserMode(!addUserMode)
  }

  const onUserSearchChange = (e) => {
    // console.log('user search', userSearch)
    setUserSearch(e.target.value)
  }

  const onChangeRole = () => {
    setUserRole(!userRole)
  }

  const onUserSearchClick = (userName, userEmail) => {
    // console.log('onUserSearchClick email', userEmail)
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowAddUserConfirmModal()
  }

  const onDeleteUser = (userName, userEmail) => {
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowDeleteUserConfirmModal()
  }

  const onUpdateUser = (userName, userEmail, userRole) => {
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    setUserRole(userRole)
    toogleShowUpdateUserConfirmModal()
  }

  const onAddUserConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      addNewUser()

    }
    toogleShowAddUserConfirmModal()
  }

  const onDeleteUserConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      deleteUser()

    }
    toogleShowDeleteUserConfirmModal()
  }

  const onUpdateUserConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      updateUser()

    }
    toogleShowUpdateUserConfirmModal()
  }

  const addNewUser = async () => {
    // console.log('email - role', userEmail, userRole)
    const data = {
      email: userSearchEmail,
      role: userRole
    }

    await addUserToBoard(boardId, data).then(() => {
      toast.success('Add user successful')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }

  const deleteUser = async () => {
    // console.log('email - role', userEmail, userRole)
    const data = {
      email: userSearchEmail
    }

    await deleteUserFromBoard(boardId, data).then(() => {
      toast.success('delete user successful')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }

  const updateUser = async () => {
    // console.log('email - role', userEmail, userRole)
    const data = {
      email: userSearchEmail,
      role: userRole
    }

    await updateUserFromBoard(boardId, data).then(() => {
      toast.success('update user successful')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }

  const onUserRoleChange = () => {
    if (userRole == 0) {
      setUserRole(1)
    } else {
      setUserRole(0)
    }
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>Card: {item.title}</span>
        <span style={{ display: 'block', textAlign: 'left', fontSize: '10px', color: 'gray' }}>Board: {item.boardName}</span>
      </>
    )
  }

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
  }

  const handleOnSelect = (item) => {
    // the item selected
    navigate(`/workplaces/${workplaceId}/boards/${boardId}/card/${item._id}`)
  }

  const handleOnFocus = () => {
  }

  const RoleFormCheck = () => (
    <Form.Check type="checkbox" label="Admin" checked={!userRole} onClick={onUserRoleChange}/>
  )

  const onCheckboxChange = (e) => {
    const newDisplayOptions = { ...displayOptions }
    if (e.target.checked) {
      newDisplayOptions[e.target.id] = true
    } else {
      newDisplayOptions[e.target.id] = false
    }
    setDisplayOptions(newDisplayOptions)
  }

  const onSlackChannelClick = () => {
    navigate('./../../slack-chat')
  }

  return (
    <Navbar className="navbar" expand="sm">
      {/* <BootstrapContainer> */}
      <Navbar.Brand className="board-navbar-brand">
        {board && board.title}
        {/* <AiFillStar className={`board-navbar-brand-icon ${likeBoard ? 'board-navbar-brand-icon-click' : ''}`} onClick={onLikeBoard}/> */}
      </Navbar.Brand>
      <Navbar.Toggle className="board-navbar-toggle" aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="board-navbar-collapse" id="basic-navbar-nav">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
            <UserListAvatar avatarList={userListAvatar} showMore={false} className="navbar-item board-user-list"/>
          </Dropdown.Toggle>
          <Dropdown.Menu className='board-user-list-menu'>
            <Dropdown.Header className='board-user-list-header'>
              {
                !boardRole ? 'Board Admin' : 'Board User'
              }
            </Dropdown.Header>
            {/* <Dropdown.Divider /> */}
            <BootstrapContainer className='user-container'>
              <Row className='user-form-row'>
                <div className='item search'>
                  <Form.Group>
                    <InputGroup className='group-search'>
                      <MdOutlinePersonAddAlt
                        className={`input-icon-add-user ${addUserMode ? 'input-icon-add-user-click' : ''}`}
                        onClick={onAddUserButton}
                      />
                      <FormControl
                        className='input-search'
                        placeholder={`${addUserMode ? 'Add user to board' : 'Search user in board'}`}
                        type='text'
                        value={userSearch}
                        onChange={onUserSearchChange}
                        // onKeyDown={e => (e.key === 'Enter' && toogleShowAddUserConfirmModal())}
                      />
                      <InputGroup.Text className='input-icon-search'><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text>

                    </InputGroup>
                    { addUserMode &&
                          <Form.Check className='input-checkbox'
                            type="checkbox"
                            label="Admin"
                            // style={{ color: 'white', fontSize: '15px' }}
                            checked={!userRole}
                            onChange={onChangeRole}
                          />
                    }

                  </Form.Group>
                </div>
              </Row>

              <Row className="user-list-row">
                <div id="scrollableDiv" className='scrollableDiv'>
                  <InfiniteScroll
                    dataLength={addUserMode ? userSearchList.length : userBoardList.length}
                    next={fetchMoreUserData}
                    hasMore={hasMore}
                    loader=<Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    scrollableTarget="scrollableDiv"
                    // height={200}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                      </p>
                    }
                  >
                    {
                      addUserMode && userSearchList && userSearchList.map(user => (
                        <Dropdown.Item key={user._id} className='notification-item' onMouseDown={() => onUserSearchClick(user.name, user.email)}>
                          <BootstrapContainer className='item-container'>
                            <Row>
                              <Col sm={3} className='item-avatar'>
                                <img className="image-avatar" src={user.cover ? user.cover : minhMaiAvatar} />
                              </Col>
                              <Col sm={9} className='item-content'>

                                <Row className='content-name'>
                                  {user.name}
                                </Row>
                                <Row className='content-email'>
                                  {user.email}
                                </Row>
                                <Row className='content-role'>
                                  Add
                                </Row>

                              </Col>
                            </Row>
                          </BootstrapContainer>


                        </Dropdown.Item>
                      ))
                    }

                    {
                      !addUserMode && userBoardList && userBoardList.map(user => (
                        <Dropdown key={user._id}>
                          <Dropdown.Toggle id="dropdown-basic-2" size='sm' as={CustomToggle}>
                            <div key={user._id} className='notification-item'>
                              <BootstrapContainer className='item-container'>
                                <Row>
                                  <Col sm={3} className='item-avatar'>
                                    <img className="image-avatar" src={user.cover ? user.cover : minhMaiAvatar} />
                                  </Col>
                                  <Col sm={9} className='item-content'>

                                    <Row className='content-name'>
                                      {user.name}
                                    </Row>
                                    <Row className='content-email'>
                                      {user.email}
                                    </Row>
                                    <Row className='content-role'>
                                      { user.role === 1 ? 'User' : 'Admin' }
                                    </Row>

                                  </Col>
                                </Row>
                              </BootstrapContainer>


                            </div>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className='item-option-menu'>
                            <Dropdown.Item onClick={() => onUpdateUser(user.name, user.email, user.role)}>Change Role</Dropdown.Item>
                            <Dropdown.Item className='delete-item' onClick={() => onDeleteUser(user.name, user.email)}>
                              <RiDeleteBin6Fill className='delete-icon'/>
                            Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ))
                    }

                  </InfiniteScroll>
                </div>
              </Row>
            </BootstrapContainer>
          </Dropdown.Menu>
        </Dropdown>

        <div className='navbar-item search'>
          <InputGroup className='group-search'>
            {/* <FormControl
                      className='input-search'
                      placeholder='Jump to...'
                    /> */}
            <div style={{ width: 250 }} className=' custom-search'>
              <ReactSearchAutocomplete
                items={items}
                onSearch={handleOnSearch}
                // onHover={handleOnHover}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                // autoFocus
                resultStringKeyName='title'
                formatResult={formatResult}
                fuseOptions={ { keys: ['title'] } }
                className='input-search search'
                placeholder='Search card...'
              />
            </div>
            {/* <InputGroup.Text className='input-icon-search'><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text> */}
          </InputGroup>
        </div>

        <div className="navbar-item board-filter">
          {/* <AiOutlineFilter className="navbar-item-icon"/> */}
          <NavDropdown
            id="nav-dropdown-dark-example"
            title="Filter"
            menuVariant="white"
          >
            <Form.Check
              type={'checkbox'}
              id='showImage'
              label='showImage'
              defaultChecked={displayOptions.showImage}
              onChange={e => onCheckboxChange(e)}
              // onClick={e => onCheckboxClick(e)}
            />
            <Form.Check
              type={'checkbox'}
              id='showStatus'
              label='showStatus'
              defaultChecked={displayOptions.showStatus}
              onChange={e => onCheckboxChange(e)}
              // onClick={e => onCheckboxClick(e)}
            />
            <Form.Check
              type={'checkbox'}
              id='showDeadline'
              label='showDeadline'
              defaultChecked={displayOptions.showStatus}
              onChange={e => onCheckboxChange(e)}
              // onClick={e => onCheckboxClick(e)}
            />
          </NavDropdown>
        </div>
        <div className="navbar-item slack-channel">

          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
              <RiSlackFill className="navbar-item-icon"/>
                  Slack Channel
            </Dropdown.Toggle>
            <Dropdown.Menu className='slack-channel-list-menu'>
              <Dropdown.Header className='slack-channel-list-header'>
                <i className='slack-workspace-content'><RiSlackFill />{ slackWorkspace ? slackWorkspace.title : '' }</i>
              </Dropdown.Header>
              {/* <Dropdown.Divider /> */}
              <BootstrapContainer className='slack-channel-list'>
                { slackChannelList &&
                      slackChannelList.map((slackChannel, index) => {
                        return <Dropdown.Item key={index} onClick={onSlackChannelClick}>#{slackChannel.slackChannel}</Dropdown.Item>
                      })
                }
              </BootstrapContainer>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar.Collapse>
      {/* </BootstrapContainer> */}
      <ConfirmModal
        show={showAddUserConfirmModal}
        onAction={onAddUserConfirmModalAction}
        title="Add user"
        content={`Are you sure you want add user <strong>${userSearchName}</strong> with email <strong>${userSearchEmail}</strong> with permission?`}
        ComponentContent={RoleFormCheck}
      />
      <ConfirmModal
        show={showDeleteUserConfirmModal}
        onAction={onDeleteUserConfirmModalAction}
        title="Delete user"
        content={`Are you sure you want delete user <strong>${userSearchName}</strong> with email <strong>${userSearchEmail}</strong>?`}
        // ComponentContent={RoleFormCheck}
      />
      <ConfirmModal
        show={showUpdateUserConfirmModal}
        onAction={onUpdateUserConfirmModalAction}
        title="Update user"
        content={`Are you sure you want update user <strong>${userSearchName}</strong> with email <strong>${userSearchEmail}</strong> with permission?`}
        ComponentContent={RoleFormCheck}
      />
    </Navbar>
  )
}

export default BoardNav