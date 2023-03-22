import React, { useState } from 'react'
import './Card.scss'
import { CloseButton } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

function Card(props) {
  const { card, onChangeToTask, onCardDelete, deleteCard } = props

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = (e) => {
    // e.preventDefault()
    e.stopPropagation()
    setShowConfirmModal(!showConfirmModal)
  }

  const toogleOffConfirmModal = () => {
    setShowConfirmModal(false)
  }

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      onCardDelete(card)
    }
    toogleOffConfirmModal()
  }

  return (
    <div className="card-item" onClick={() => onChangeToTask(card)}>
      {
        card.imageUrl && <img src={card.imageUrl} className='card-cover' alt='image1' onMouseDown={e => e.preventDefault()}/>
      }
      {/* <div className='card-title'>{card.title}</div> */}
      {card.title}
      { deleteCard &&
        <CloseButton className='card-close-button' onClick={(e) => toogleShowConfirmModal(e)}></CloseButton>
      }

      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`<strong>Are you sure you want to remove card ${card.title}</strong>`}
      />
    </div>
  )
}

export default Card