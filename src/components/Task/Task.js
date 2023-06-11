import { uploadCardImage } from 'actions/APICall'
import React, { useCallback, useEffect, useState } from 'react'

import { useDropzone } from 'react-dropzone'

import Button from 'react-bootstrap/Button'
import { Container, ProgressBar, Row, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'

import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { getCard, updateCard } from 'actions/APICall'

import { isEqual } from 'lodash'

import { FaUpload, FaRegCalendarAlt, FaTasks, FaUserAlt } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { GiBackwardTime } from 'react-icons/gi'

import DatePicker from 'react-datepicker'
import { format } from 'date-fns'

import UserListAvatar from 'components/User/UserListAvatar'

import './Task.scss'
import { toast } from 'react-toastify'

const toDoListInit = [
  { id: '0123',
    name: 'test',
    done: true

  },
  { id: '0124',
    name: 'danh sach 2',
    done: true

  },
  { id: '0125',
    name: 'danh sach 33',
    done: true

  }
]

function Task() {
  const [ clickedCard, setClickedCard ] = useState()
  const [ updatedCard, setUpdatedCard ] = useState()

  // const { _id, title, imageUrl } = clickedCard
  const [cardImage, setCardImage] = useState('')
  const [fileUpload, setFileUpLoad] = useState(null)
  const [toDoList, setToDoList] = useState(toDoListInit)
  const [progress, setProgress] = useState(0)
  const [onChangeCard, setOnchangeCard] = useState(false)
  const [userList, setUserList] = useState([])


  const { taskId } = useParams()

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [cardTitle, setCardTitle] = useState('')
  const [cardDescription, setCardDescription] = useState('')

  const handleCardTitleChange = useCallback((e) => setCardTitle(e.target.value), [])
  const handleCardDescriptionChange = useCallback((e) => setCardDescription(e.target.value), [])


  useEffect(() => {
    getCard(taskId).then(card => {
      setClickedCard(card)

      // Create update card to check when update data in card
      setUpdatedCard(card)
    })
  }, [taskId])

  useEffect(() => {
    if (!isEqual(clickedCard, updatedCard)) {
      console.log('vaof check equal')
      console.log('click card', clickedCard)
      console.log('updatedCard', updatedCard)
      setOnchangeCard(true)
    } else {
      setOnchangeCard(false)
    }
  }, [clickedCard, updatedCard])

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
    let doneNumber = 0
    toDoList.map(t => {
      if (t.done) {
        doneNumber++
      }
    }
    )

    console.log('doneNumber', doneNumber)
    const percent = doneNumber / toDoList.length * 100
    setProgress(Math.round(percent))

    console.log('percent', percent)

  }, [toDoList])

  useEffect(() => {
    if (clickedCard && clickedCard.startTime && clickedCard.endTime) {
      console.log('clicked card when set time', clickedCard)
      const convertStartTime = new Date(clickedCard.startTime)
      const convertEndTime = new Date(clickedCard.endTime)
      setStartDate(convertStartTime)
      setEndDate(convertEndTime)
    }

    if (clickedCard) {
      setCardTitle(clickedCard.title)
      setCardDescription(clickedCard.description)
    }
  }, [clickedCard])

  const onDrop = useCallback((files) => {
    const formData = new FormData()
    formData.append('file', files[0])
    console.log('file', files[0])

    uploadCardImage(clickedCard._id, formData, {
      onUploadProgress: (p) => {
        const percentCompleted = Math.round((p.loaded * 100) / p.total)
        setFileUpLoad({ fileName: files[0].name, percentCompleted })
        console.log(`${percentCompleted}% uploaded`)
      }
    }).then((data) => {
      setCardImage(data.url)
      clickedCard.imageUrl = data.url
      const newClickedCard = { ...clickedCard }
      setClickedCard(newClickedCard)

    })
  }, [clickedCard])

  useEffect(() => {

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


  const navigate = useNavigate()
  console.log('clickedCard', clickedCard)

  const backToBoard = () => {
    navigate('../')
  }

  const changeToDoStatus = (toDo) => {
    let newToDoList = [...toDoList]

    const currentToDo = newToDoList.find( t => t.id === toDo.id)

    currentToDo.done = !currentToDo.done

    setToDoList(newToDoList)


  }

  const onUpdateCard = () => {
    if (!isEqual(clickedCard, updatedCard)) {
      setOnchangeCard(true)
      updateCard(updatedCard._id, updatedCard).then(
        card => {
          setClickedCard(updatedCard)
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
          <Row className='image-upload'>
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
                  <Col>
                    <GiBackwardTime className='icon-deadline'/>
                    { endDate &&
                      format(endDate, 'MMMM d, yyyy h:mm aa')
                    }
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
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <FaTasks className='icon' />
                ToDo
                </Accordion.Header>
                <Accordion.Body>
                  {console.log('todo', toDoList)}
                  {
                    toDoList.map((todo) => (
                      <Form.Check
                        key={todo.id}
                        type='checkbox'
                        label={todo.name}
                        checked={todo.done}
                        onChange={() => changeToDoStatus(todo)}
                      />
                    ))
                  }

                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <FaUserAlt className='icon' />
                User
                  <p className='user-list'>
                    <UserListAvatar />
                  </p>

                </Accordion.Header>
                <Accordion.Body>

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>

          <Row className='control-button-row'>
            { onChangeCard &&
            <Button className='save-button' onClick={onUpdateCard}>Save</Button>
            }

            { !onChangeCard &&
            <Button className='save-button' disabled>Not Save</Button>
            }

            <Button variant='secondary' className='cancel-button' onClick={backToBoard}>Cancel</Button>
          </Row>
        </Container>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  )
}

export default Task
