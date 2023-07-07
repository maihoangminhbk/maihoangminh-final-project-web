import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'

import { useDropzone } from 'react-dropzone'

import Button from 'react-bootstrap/Button'
import { Container, ProgressBar, Row, Col, InputGroup, FormControl, Dropdown } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'

import { getCard, updateCard, uploadCardImage, searchUsersInCard, searchUsersToAddCard, addUserToCard, deleteUserFromCard } from 'actions/APICall'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import ConfirmModal from 'components/Common/ConfirmModal'

import CustomToggle from 'components/Common/CustomToggle'
import InfiniteScroll from 'react-infinite-scroll-component'

import { isEqual } from 'lodash'

import { FaUpload, FaRegCalendarAlt, FaTasks, FaUserAlt } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { GiBackwardTime } from 'react-icons/gi'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { SiGooglecalendar } from 'react-icons/si'


import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { statusMap } from 'utilities/statusMap'

import UserListAvatar from 'components/User/UserListAvatar'
import minhMaiAvatar from 'actions/images/userAvatar.png'

import './Task.scss'
import { toast } from 'react-toastify'
import TodoList from 'components/TodoList/TodoList'

function Task() {
  console.log('check')
  const setClickedCardToBoard = useOutletContext()
  const [ clickedCard, setClickedCard ] = useState()
  const [ updatedCard, setUpdatedCard ] = useState()

  // const { _id, title, imageUrl } = clickedCard
  const [cardImage, setCardImage] = useState('')
  const [fileUpload, setFileUpLoad] = useState(null)
  const [todoList, setTodoList] = useState([])


  const [progress, setProgress] = useState(0)

  const [onChangeCard, setOnchangeCard] = useState(false)

  const [addUserMode, setAddUserMode] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userBoardList, setUserBoardList] = useState([])
  const [userSearchList, setUserSearchList] = useState([])
  const [userListAvatar, setUserListAvatar] = useState([])
  const [userSearchName, setUserSearchName] = useState('')
  const [userSearchEmail, setUserSearchEmail] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [userListPage, setUserListPage] = useState(1)


  const { cardId } = useParams()

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [cardTitle, setCardTitle] = useState('')
  const [cardDescription, setCardDescription] = useState('')
  const [cardStatus, setCardStatus] = useState()

  const handleCardTitleChange = useCallback((e) => setCardTitle(e.target.value), [])
  const handleCardDescriptionChange = useCallback((e) => setCardDescription(e.target.value), [])

  const [showAddUserConfirmModal, setShowAddUserConfirmModal] = useState(false)
  const toogleShowAddUserConfirmModal = () => setShowAddUserConfirmModal(!showAddUserConfirmModal)

  const [showDeleteUserConfirmModal, setShowDeleteUserConfirmModal] = useState(false)
  const toogleShowDeleteUserConfirmModal = () => setShowDeleteUserConfirmModal(!showDeleteUserConfirmModal)

  useEffect(() => {
    getCard(cardId).then(card => {
      if (card.tasks) {
        setTodoList(card.tasks)
        delete card.tasks
      }

      setClickedCard(card)

      // Create update card to check when update data in card
      setUpdatedCard(card)
    })
  }, [cardId, setClickedCardToBoard])

  useEffect(() => {
    if (!isEqual(clickedCard, updatedCard) && updatedCard) {
      setOnchangeCard(true)
    } else {
      setOnchangeCard(false)
    }
  }, [clickedCard, updatedCard])

  useEffect(() => {
    console.log('onChangeCard', onChangeCard)
    if (onChangeCard) {
      onUpdateCard()
    }
  }, [onChangeCard])

  useEffect(() => {
    if (startDate && endDate) {
      const newUpdatedCard = {
        ...updatedCard,
        startTime: startDate.getTime(),
        endTime: endDate.getTime()
      }

      setUpdatedCard(newUpdatedCard)
    }

  }, [startDate, endDate])

  useEffect(() => {
    if (clickedCard && clickedCard.startTime && clickedCard.endTime) {
      const convertStartTime = new Date(clickedCard.startTime)
      const convertEndTime = new Date(clickedCard.endTime)
      setStartDate(convertStartTime)
      setEndDate(convertEndTime)
    }

    if (clickedCard) {
      console.log('clickedCard', clickedCard)
      setCardTitle(clickedCard.title)
      setCardDescription(clickedCard.description)
      setCardStatus(clickedCard.status)
      setCardImage(clickedCard.imageUrl)
    }
  }, [clickedCard])

  useEffect(() => {
    const searchData = {
      keyword: '',
      page: 1
    }
    searchUsersInCard(cardId, searchData).then(result => {
      const listAvatar = result.map(user => (
        user.cover
      ))

      setUserListAvatar(listAvatar)
    }
    )
  }, [cardId])

  const onDrop = useCallback((files) => {
    console.log('upload file', files)
    const formData = new FormData()
    formData.append('file', files[0])

    uploadCardImage(clickedCard._id, formData, {
      onUploadProgress: (p) => {
        const percentCompleted = Math.round((p.loaded * 100) / p.total)
        setFileUpLoad({ fileName: files[0].name, percentCompleted })
      }
    }).then((data) => {
      console.log('upload image', data)
      setCardImage(data.url)
      clickedCard.imageUrl = data.url
      const newClickedCard = { ...clickedCard }
      setClickedCard(newClickedCard)

    })
  }, [clickedCard])

  useEffect(() => {
    setUserListPage(1)

    if (addUserMode) {
      const searchData = {
        keyword: userSearch,
        page: 1
      }
      searchUsersToAddCard(cardId, searchData).then(result => {
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
      searchUsersInCard(cardId, searchData).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        setUserBoardList(result)
      }
      )}
  }, [userSearch, cardId, addUserMode])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


  const navigate = useNavigate()

  const backToBoard = () => {
    navigate('../')
  }

  const onUpdateCard = () => {
    if (!isEqual(clickedCard, updatedCard)) {
      setOnchangeCard(true)
      updateCard(updatedCard._id, updatedCard).then(
        card => {
          setClickedCard(updatedCard)
          setClickedCardToBoard(updatedCard)
          toast.success('Update successful')
        }
      ).catch(
        e => {
          toast.error('Error when update')
        }
      )
    } else {
      setOnchangeCard(false)
      return
    }
  }

  const handleCardTitleBlur = () => {

    if (cardTitle !== clickedCard.title) {

      const newUpdatedCard = {
        ...updatedCard,
        title: cardTitle
      }
      setUpdatedCard(newUpdatedCard)
    }
  }

  const handleCardDescriptionBlur = () => {

    if (cardDescription !== clickedCard.description) {

      const newUpdatedCard = {
        ...updatedCard,
        description: cardDescription
      }
      setUpdatedCard(newUpdatedCard)
    }
  }

  const onAddUserButton = () => {
    setAddUserMode(!addUserMode)
  }

  const onUserSearchChange = (e) => {
    // console.log('user search', userSearch)
    setUserSearch(e.target.value)
  }

  const onDeleteUser = (userName, userEmail) => {
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowDeleteUserConfirmModal()
  }

  const onUserSearchClick = (userName, userEmail) => {
    // console.log('onUserSearchClick email', userEmail)
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowAddUserConfirmModal()
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

    await addUserToCard(cardId, data).then(() => {
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

    await deleteUserFromCard(cardId, data).then(() => {
      toast.success('delete user successful')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }

  const fetchMoreUserData = () => {
    if (addUserMode) {
      const searchData = {
        keyword: userSearch,
        page: userListPage + 1
      }


      searchUsersToAddCard(cardId, searchData).then(result => {
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


      searchUsersInCard(cardId, searchData).then(result => {
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

  const createStatus = (statusId) => {
    const status = statusMap.find(status => status.statusId === statusId)
    if (status) {
      return <div className={`${status.className} icon-option badge`}>
        {status.title}
        <AiOutlineCaretDown />
      </div>
    }
  }

  const onCardChangeStatus = (statusId) => {
    const newUpdatedCard = {
      ...updatedCard,
      status: statusId
    }
    setUpdatedCard(newUpdatedCard)
    setCardStatus(statusId)
  }

  const linkToCalendar = () => {
    let convertStartTime
    let convertEndTime
    if (clickedCard && clickedCard.startTime && clickedCard.endTime) {
      convertStartTime = format(clickedCard.startTime, 'yyyymmdd:HHmm')
      convertEndTime = format(clickedCard.endTime, 'yyyymmdd:HHmm')
    }
    console.log(convertStartTime)
    const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${cardTitle}&details=Event description text&dates=${convertStartTime}/${convertEndTime}`
    return <a href={link} target='_blank' rel="noreferrer">Add to Google Calendar</a>
  }

  return (
    <Modal
      onHide={backToBoard}
      show='true'
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='card-modal'
    >
      <Modal.Header closeButton className='card-modal-header'>
        <Modal.Title id="contained-modal-title-vcenter">
          <div className='card-title'>
            <Form.Control
              className='trello-clone-content-editable'
              size="md"
              type="text"
              value={cardTitle}
              spellCheck="false"
              onClick={selectAllInlineText}
              onChange={handleCardTitleChange}
              onBlur={handleCardTitleBlur}
              onMouseDown={e => e.preventDefault()}
              onKeyDown={saveContentAfterPressEnter}
            />
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='card-modal-body'>
        <Container className='task-container'>
          {cardImage && <Row>
            <img src={cardImage} className='card-cover' alt='image1'/>
          </Row>}
          <Row className='image-upload-row'>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <div>
                    <p>Drop the files here ...</p>

                  </div> :
                  <div>
                    <p><FaUpload className='upload-icon' /></p>
                    <p>Drag drop some files here, or click to select files</p>
                  </div>
              }
            </div>
          </Row>
          <Row>
            <br></br>
            <h4>Description</h4>
            <div className='card-description'>
              <Form.Control
                className='trello-clone-content-editable'
                size="md"
                type="text"
                value={cardDescription}
                spellCheck="false"
                onClick={selectAllInlineText}
                onChange={handleCardDescriptionChange}
                onBlur={handleCardDescriptionBlur}
                onMouseDown={e => e.preventDefault()}
                onKeyDown={saveContentAfterPressEnter}
              />
            </div>
          </Row>
          <Row className='progress-row'>
            <h4>Progress</h4>
            <ProgressBar now={progress} label={`${progress}%`} />
          </Row>
          <Row className='status-row'>
            <h4>Status</h4>
            <div className='status-option'>
              <Dropdown className='todo-list-options-dropdown'>
                <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle} className='dropdown-toggle'>
                  {/* <div className='icon-option badge'> */}
                  {
                    createStatus(cardStatus)
                  }
                  {/* </div> */}
                </Dropdown.Toggle>
                <Dropdown.Menu className='item-option-menu'>
                  {
                    statusMap.map(status => (
                      <Dropdown.Item
                        key={status.statusId}
                        className={`${status.className} item-option badge`}
                        onClick={() => onCardChangeStatus(status.statusId)}
                      >
                        { status.title }
                      </Dropdown.Item>
                    ))
                  }

                </Dropdown.Menu>
              </Dropdown>

            </div>
          </Row>
          <Row className='addition-row'>
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  {/* <Col sm={1}>

                </Col> */}
                  <Col sm ={2}>
                    <FaRegCalendarAlt className='icon'/>
                  Deadline
                  </Col>
                  <Col sm={4}>
                    <GiBackwardTime className='icon-deadline'/>
                    { endDate &&
                      format(endDate, 'MMMM d, yyyy h:mm aa')
                    }
                  </Col>
                  <Col sm={3} className='google-calendar'>
                    <SiGooglecalendar className='icon-google-calendar'/>
                    { linkToCalendar() }
                  </Col>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col sm={2}>
                      <BiTime className='icon'/>
                    Start time
                    </Col>
                    <Col>
                      <DatePicker
                        selected={startDate}
                        selectsStart
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={2}>
                      <BiTime className='icon'/>
                    End time
                    </Col>
                    <Col>
                      <DatePicker
                        selected={endDate}
                        selectsEnd
                        onChange={(date) => setEndDate(date)}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className='todo-list-accordion' eventKey="1">
                <Accordion.Header>
                  <FaTasks className='icon' />
                ToDo
                </Accordion.Header>
                <Accordion.Body className='todo-list-accordion-body'>
                  {todoList &&
                    <TodoList todoList={todoList} setProgress={setProgress}/>
                  }
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2" className='user-list-accordion'>
                <Accordion.Header className='user-list-accordion-header'>
                  <FaUserAlt className='icon' />
                User
                  <div className='user-list'>
                    <UserListAvatar avatarList={userListAvatar} showMore={false} />
                  </div>

                </Accordion.Header>
                <Accordion.Body className='user-list-accordion-body'>
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
                              <Dropdown key={user._id}>
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
                                          {/* <Row className='content-role'>
                                            { user.role === 1 ? 'User' : 'Admin' }
                                          </Row> */}

                                        </Col>
                                      </Row>
                                    </Container>


                                  </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='item-option-menu'>
                                  <Dropdown.Item className='delete-item' onMouseDown={() => onDeleteUser(user.name, user.email)}>
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

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>

          {/* <Row className='control-button-row'>
            { onChangeCard &&
            <Button className='save-button' onClick={onUpdateCard}>Save</Button>
            }

            { !onChangeCard &&
            <Button className='save-button' disabled>Not Save</Button>
            }

            <Button variant='secondary' className='cancel-button' onClick={backToBoard}>Cancel</Button>
          </Row> */}
        </Container>
      </Modal.Body>
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
    </Modal>
  )
}

export default Task
