import { Modal, Button } from 'react-bootstrap'
import React from 'react'
import HTMLReactParser from 'html-react-parser'
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from 'utilities/constants'

function ConfirmModal(props) {
  const { title, content, ComponentContent, show, onAction } = props

  const onClickAction = (e, type) => {
    e.stopPropagation()
    onAction(type)
  }

  return (
    <Modal
      show={show}
      onHide={() => onAction(MODAL_ACTION_CLOSE)}
      backdrop="static"
    >

      <Modal.Header closeButton>
        <Modal.Title className='h5'>{HTMLReactParser(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {HTMLReactParser(content)}
        { ComponentContent && <ComponentContent /> }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={(e) => onClickAction(e, MODAL_ACTION_CLOSE)}>
              Close
        </Button>
        <Button variant="primary" onClick={(e) => onClickAction(e, MODAL_ACTION_CONFIRM)}>
              Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

  )
}

export default ConfirmModal