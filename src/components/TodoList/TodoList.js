import React, { useEffect, useState } from 'react'

import { Container, Row, Col, InputGroup, FormControl, Dropdown } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'

import { useParams } from 'react-router-dom'
import { updateTask, createNewTask, searchUsersToAddTask, searchUsersInTask, addUserToTask, deleteUserFromTask } from 'actions/APICall'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import ConfirmModal from 'components/Common/ConfirmModal'

import CustomToggle from 'components/Common/CustomToggle'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FaUserAlt } from 'react-icons/fa'
import { GiBackwardTime } from 'react-icons/gi'
import { MdPlaylistAdd, MdOutlinePersonAddAlt } from 'react-icons/md'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import Spinner from 'react-bootstrap/Spinner'


import DatePicker from 'react-datepicker'

import UserListAvatar from 'components/User/UserListAvatar'
import minhMaiAvatar from 'actions/images/userAvatar.png'

import { toast } from 'react-toastify'

import { statusMap } from 'utilities/statusMap'

import './TodoList.scss'

function TodoList(props) {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [todoList, setTodoList] = useState([])
  const [todoStartDate, setTodoStartDate] = useState()
  const [todoEndDate, setTodoEndDate] = useState()
  const [todoStatus, setTodoStatus] = useState()
  const [updateTodoId, setUpdateTodoId] = useState()

  const [addUserMode, setAddUserMode] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userBoardList, setUserBoardList] = useState([])
  const [userSearchList, setUserSearchList] = useState([])
  const [userListPage, setUserListPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [userSearchName, setUserSearchName] = useState('')
  const [userSearchEmail, setUserSearchEmail] = useState('')

  const [chooseTaskId, setChooseTaskId] = useState()

  const [showAddUserConfirmModal, setShowAddUserConfirmModal] = useState(false)
  const toogleShowAddUserConfirmModal = () => setShowAddUserConfirmModal(!showAddUserConfirmModal)

  const [showDeleteUserConfirmModal, setShowDeleteUserConfirmModal] = useState(false)
  const toogleShowDeleteUserConfirmModal = () => setShowDeleteUserConfirmModal(!showDeleteUserConfirmModal)

  const { cardId } = useParams()


  useEffect(() => {
    setTodoList(props.todoList)
  }, [props.todoList])

  useEffect(() => {
    if (todoStartDate && todoEndDate) {
      const updateData = {
        startTime: todoStartDate,
        endTime: todoEndDate
      }

      updateTask(updateTodoId, updateData).then(newTask => {
        let newTodoList = [...todoList]

        const currentToDo = newTodoList.find( t => t._id === newTask._id)

        currentToDo.startTime = newTask.startTime
        currentToDo.endTime = newTask.endTime

        setTodoList(newTodoList)
      }).catch(e => {
        toast.error(e)
      })
    }

  }, [todoStartDate, todoEndDate, updateTodoId])

  useEffect(() => {
    if (chooseTaskId) {
      setUserListPage(1)

      if (addUserMode) {
        const searchData = {
          keyword: userSearch,
          page: 1
        }
        searchUsersToAddTask(chooseTaskId, searchData).then(result => {
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
        searchUsersInTask(chooseTaskId, searchData).then(result => {
          if (result && result.length == 0) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
          setUserBoardList(result)
        }
        )}
    }
  }, [userSearch, chooseTaskId, addUserMode])

  //   useEffect(() => {
  //     let doneNumber = 0
  //     todoList.map(t => {
  //       if (t.checked) {
  //         doneNumber++
  //       }
  //     }
  //     )

  //     const percent = doneNumber / todoList.length * 100
  //     setProgress(Math.round(percent))


  //   }, [todoList])

  const onNewTodoTitleChange = (e) => {
    setNewTodoTitle(e.target.value)
  }

  const onAddTodo = () => {
    if (!newTodoTitle) {
      return
    }

    const newTodoToAdd = {
      cardId: cardId,
      title: newTodoTitle.trim()
    }


    // Call API
    createNewTask(newTodoToAdd).then(task => {
      let newTodoList = [...todoList]
      newTodoList.push(task)

      setTodoList(newTodoList)

      setNewTodoTitle('')

      toast.success('Create task successfully')

    }).catch((error) => {
      setNewTodoTitle('')
      toast.error(error.message)
    })
  }

  const onChangeToDoChecked = (todo) => {
    const updateData = {
      checked: !todo.checked
    }

    if (todo.status !== 3 && todo.status !== 5 && todo.checked === false) {
      if (todo.date > new Date()) {
        updateData.status = 4
      } else {
        updateData.status = 2
      }
    }

    if (todo.status !== 3 && todo.status !== 5 && todo.checked === true) {
      if (todo.date > new Date()) {
        updateData.status = 4
      } else {
        updateData.status = 1
      }
    }

    updateTask(todo._id, updateData).then(newTask => {
      let newTodoList = [...todoList]

      const currentToDo = newTodoList.find( t => t._id === todo._id)

      currentToDo.checked = !currentToDo.checked
      currentToDo.status = newTask.status

      setTodoList(newTodoList)
    }).catch(e => {
      toast.error(e)
    })


  }

  const onTodoStartTimeChange = (date, taskId) => {

    const updateData = {
      startTime: date.getTime()
    }

    updateTask(taskId, updateData).then(newTask => {
      let newTodoList = [...todoList]

      const currentToDo = newTodoList.find( t => t._id === newTask._id)

      currentToDo.startTime = newTask.startTime

      setTodoList(newTodoList)
    }).catch(e => {
      toast.error(e)
    })

  }

  const onTodoEndTimeChange = (date, taskId) => {

    const updateData = {
      endTime: date.getTime()
    }

    updateTask(taskId, updateData).then(newTask => {
      let newTodoList = [...todoList]

      const currentToDo = newTodoList.find( t => t._id === newTask._id)

      currentToDo.endTime = newTask.endTime

      setTodoList(newTodoList)
    }).catch(e => {
      toast.error(e)
    })

  }

  const onTodoChangeStatus = (statusId, taskId) => {
    const updateData = {
      status: statusId
    }

    updateTask(taskId, updateData).then(newTask => {
      let newTodoList = [...todoList]

      const currentToDo = newTodoList.find(t => t._id === newTask._id)

      currentToDo.status = newTask.status

      setTodoList(newTodoList)
    }).catch(e => {
      toast.error(e)
    })
  }

  const onAddUserButton = () => {
    setAddUserMode(!addUserMode)
  }

  const onUserSearchChange = (e) => {
    // console.log('user search', userSearch)
    setUserSearch(e.target.value)
  }

  const onUserSearchClick = (userName, userEmail) => {
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowAddUserConfirmModal()
  }

  const onDeleteUser = (userName, userEmail) => {
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowDeleteUserConfirmModal()
  }

  const fetchMoreUserData = () => {
    if (addUserMode) {
      const searchData = {
        keyword: userSearch,
        page: userListPage + 1
      }


      searchUsersToAddTask(chooseTaskId, searchData).then(result => {
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


      searchUsersInTask(chooseTaskId, searchData).then(result => {
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


  const addNewUser = async () => {
    // console.log('email - role', userEmail, userRole)
    const data = {
      email: userSearchEmail
    }

    await addUserToTask(chooseTaskId, data).then(() => {
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

    await deleteUserFromTask(chooseTaskId, data).then(() => {
      toast.success('delete user successful')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }

  const createStatus = (statusId) => {
    const status = statusMap.find(status => status.statusId === statusId)
    if (status) {
      return <div className={`${status.className} icon-option badge`}>
        {status.title}
        <AiOutlineCaretDown />
      </div>
    }
  }


  return (
    <Container className='todo-container'>
      <Row className='todo-form-row'>
        <div className='item search'>
          <Form.Group>
            <InputGroup className='group-search'>
              <MdPlaylistAdd
                className='input-icon-add-todo'
                onClick={onAddTodo}
              />
              <FormControl
                className='input-search'
                placeholder='Add new task'
                type='text'
                value={newTodoTitle}
                onChange={onNewTodoTitleChange}
                onKeyDown={e => (e.key === 'Enter' && onAddTodo())}
              />

            </InputGroup>
          </Form.Group>
        </div>
      </Row>

      <Row className="todo-list-row">
        { todoList && todoList.map((todo) => (
          <Row key={todo._id}>
            <Col xs={8} md={7} className='todo-list-check'>
              <Form.Check
                type='checkbox'
                label={todo.title}
                checked={todo.checked}
                onChange={() => onChangeToDoChecked(todo)}
              />

            </Col>
            <Col xs={4} md={5} className='todo-list-options'>
              <Row>
                <Col xs={4} sm={2} className='deadline-option'>
                  <Dropdown className='todo-list-options-dropdown'>
                    <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
                      <GiBackwardTime className='icon-option'/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='item-option-menu'>
                      <Row className='item-option-menu-row'>
                        <Col xs={2} className='item-option-menu-text'>
                          {/* <BiTime className='icon'/> */}
                                          Start time
                        </Col>
                        <Col xs={10} className='item-option-menu-calendar'>
                          <DatePicker
                            selected={todo.startTime}
                            selectsStart
                            onChange={(date) => onTodoStartTimeChange(date, todo._id)}
                            showTimeSelect
                            startDate={todo.startTime}
                            endDate={todo.endTime}
                            dateFormat="MMMM d, yyyy h:mm aa"
                          />
                        </Col>
                      </Row>

                      <Row className='item-option-menu-row'>
                        <Col xs={2} className='item-option-menu-text'>
                          {/* <BiTime className='icon'/> */}
                                          End time
                        </Col>
                        <Col xs={10} className='item-option-menu-calendar'>
                          <DatePicker
                            selected={todo.endTime}
                            selectsEnd
                            onChange={(date) => onTodoEndTimeChange(date, todo._id)}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            startDate={todo.startTime}
                            endDate={todo.endTime}
                            minDate={todo.startTime}
                          />
                        </Col>
                      </Row>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col xs={4} sm={2} className='status-option'>
                  <Dropdown className='todo-list-options-dropdown'>
                    <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
                      {/* <div className='icon-option badge'> */}
                      {
                        createStatus(todo.status)
                      }
                      {/* </div> */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='item-option-menu'>
                      {
                        statusMap.map(status => (
                          <Dropdown.Item
                            key={status.statusId}
                            className={`${status.className} item-option badge`}
                            onClick={() => onTodoChangeStatus(status.statusId, todo._id)}
                          >
                            { status.title }
                          </Dropdown.Item>
                        ))
                      }

                    </Dropdown.Menu>
                  </Dropdown>

                </Col>
                <Col xs={4} sm={2} className='user-option'>
                  <Dropdown className='todo-list-options-dropdown' onToggle={() => setChooseTaskId(todo._id)}>
                    <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
                      <FaUserAlt className='icon-option'/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='item-option-menu'>
                      <Container className='user-container'>
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
                            </Form.Group>
                          </div>
                        </Row>

                        <Row className="user-list-row">
                          <div id="scrollableDiv" className='scrollableDiv'>
                            <InfiniteScroll
                              dataLength={addUserMode ? userSearchList.length : userBoardList.length}
                              // dataLength={4}
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
                                    <Container className='item-container'>
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
                                    </Container>


                                  </Dropdown.Item>
                                ))
                              }

                              {
                                !addUserMode && userBoardList && userBoardList.map(user => (
                                  <Dropdown
                                    key={user._id}
                                    onToggle={() => console.log('ontoogle')}
                                    className='todo-user-dropdown'
                                  >
                                    <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
                                      <div key={user._id} className='notification-item'>
                                        <Container className='item-container'>
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
                                            </Col>
                                          </Row>
                                        </Container>
                                      </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='item-option-menu'>
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
                      </Container>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
          </Row>
        ))
        }
      </Row>
      <ConfirmModal
        show={showAddUserConfirmModal}
        onAction={onAddUserConfirmModalAction}
        title="Add user"
        content={`Are you sure you want add user <strong>${userSearchName}</strong> with email <strong>${userSearchEmail}</strong> with permission?`}
      />
      <ConfirmModal
        show={showDeleteUserConfirmModal}
        onAction={onDeleteUserConfirmModalAction}
        title="Delete user"
        content={`Are you sure you want delete user <strong>${userSearchName}</strong> with email <strong>${userSearchEmail}</strong>?`}
        // ComponentContent={RoleFormCheck}
      />
    </Container>
  )
}

export default TodoList