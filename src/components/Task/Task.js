import { uploadCardImage } from 'actions/APICall'
import React, { useCallback, useEffect, useState } from 'react'

import { useDropzone } from 'react-dropzone'

import Button from 'react-bootstrap/Button'
import { Container, ProgressBar, Row, Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { getCard } from 'actions/APICall'

import { FaUpload, FaRegCalendarAlt, FaTasks, FaUserAlt } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { GiBackwardTime } from 'react-icons/gi'

import DatePicker from 'react-datepicker'
import { format } from 'date-fns'

import UserListAvatar from 'components/User/UserListAvatar'

import './Task.scss'

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

  // const { _id, title, imageUrl } = clickedCard
  const [cardImage, setCardImage] = useState('')
  const [fileUpload, setFileUpLoad] = useState(null)
  const [toDoList, setToDoList] = useState(toDoListInit)
  const [progress, setProgress] = useState(0)
  const { taskId } = useParams()

  const [startDate, setStartDate] = useState(
    // setHours(setMinutes(new Date(), 0), 1)
    new Date()
  )

  const [endDate, setEndDate] = useState(new Date())

  useEffect(() => {
    getCard(taskId).then(card => {
      setClickedCard(card)
      // console.log('clicked card', card)
    })
  }, [])

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
    console.log('date', format(new Date(), 'MMMM d, yyyy h:mm aa'))
    console.log('start date', startDate)
    console.log('end date', endDate)
  }, [startDate, endDate])

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

  return (
    <Modal
      onHide={backToBoard}
      show='true'
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {clickedCard && clickedCard.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <p>
              This is card. I create to test modal...
            </p>
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
                    {format(endDate, 'MMMM d, yyyy h:mm aa')}
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
        </Container>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  )
}

export default Task
