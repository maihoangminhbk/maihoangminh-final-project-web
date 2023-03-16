import { uploadCardImage } from 'actions/APICall'
import React, { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'

import Button from 'react-bootstrap/Button'
import { Container, ProgressBar, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { FaUpload } from 'react-icons/fa'

import './Task.scss'

function Task() {
  const { clickedCard, setClickedCard } = useOutletContext()

  const { _id, title, imageUrl } = clickedCard
  const [cardImage, setCardImage] = useState(imageUrl)
  const [fileUpload, setFileUpLoad] = useState(null)

  const onDrop = useCallback((files) => {
    const formData = new FormData()
    formData.append('file', files[0])
    console.log('file', files[0])

    uploadCardImage(_id, formData, {
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
          {/* <Row>
            <div>
              { fileUpload && <ProgressBar now={fileUpload.percentCompleted} /> }
            </div>
          </Row> */}
          <Row>
            <br></br>
            <h4>Description</h4>
            <p>
              This is card. I create to test modal...
            </p>
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
