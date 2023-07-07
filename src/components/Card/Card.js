import React, { useEffect, useState } from 'react'
import './Card.scss'
import { CloseButton } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'

import { format } from 'date-fns'

import { GiBackwardTime } from 'react-icons/gi'
import { AiOutlineCaretDown } from 'react-icons/ai'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { statusMap } from 'utilities/statusMap'

function Card(props) {
  const { card, onChangeToTask, onCardDelete, deleteCard } = props

  const [deadline, setDeadline] = useState()

  useEffect(() => {
    if (card.endTime) {
      const cardDeadline = format(card.endTime, 'MMMM d')
      setDeadline(cardDeadline)
    }
  }, [card.endTime])

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

  const createStatus = (statusId) => {
    const status = statusMap.find(status => status.statusId === statusId)
    if (status) {
      return <div className={`${status.className} icon-option badge`}>
        {status.title}
      </div>
    }
  }

  return (
    <div className="card-item" onClick={() => onChangeToTask(card)}>
      {
        props.displayOptions.showImage && card.imageUrl && <img src={card.imageUrl} className='card-cover' alt='image1' onMouseDown={e => e.preventDefault()}/>
      }
      {/* <div className='card-title'>{card.title}</div> */}
      {card.title}
      <div className='card-options'>
        { props.displayOptions.showStatus &&
          <div className='card-status'>
            { createStatus(card.status) }
          </div>
        }
        { props.displayOptions.showDeadline && deadline &&
        <div className='card-deadline'>
          <GiBackwardTime className='icon-deadline'/>
          {deadline}
        </div>
        }
      </div>
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