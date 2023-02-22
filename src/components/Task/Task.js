import { uploadCardImage } from 'actions/APICall'
import React, { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'

import Button from 'react-bootstrap/Button'
import { ProgressBar } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useNavigate, useOutletContext } from 'react-router-dom'

import './Task.scss'

function Task() {
  const clickedCard = useOutletContext()

  const { _id, title, cover } = clickedCard
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
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag drop some files here, or click to select files</p>
          }
        </div>
        <div>
          { fileUpload && <ProgressBar now={fileUpload.percentCompleted} /> }
        </div>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  )
}

export default Task
