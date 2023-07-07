import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import { cloneDeep } from 'lodash'

import './Column.scss'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import { mapOrder } from 'utilities/sorts'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'
import { createNewCard, updateColumn } from 'actions/APICall'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


function Column(props) {
  const { column, onCardDrop, onUpdateColumnState, onCardClick, onCardDelete, displayOptions } = props
  const cards = mapOrder(column.cards, column.cardOrder, '_id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [deleteCard, setDeleteCard] = useState(false)

  const newCardTextareaRef = useRef(null)

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = useCallback((e) => setNewCardTitle(e.target.value), [])

  const navigate = useNavigate()

  const toogleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }

  const toggleDeleteCard = () => {
    setDeleteCard(!deleteCard)
  }

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()
    }
  }, [openNewCardForm])

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy : true
      }

      // Call API update column
      updateColumn(newColumn._id, newColumn).then(updatedColumn => {

        onUpdateColumnState(updatedColumn)
      }).catch((error) => {
        toast.error(error.message)
        toogleShowConfirmModal()
      })

    }
    toogleShowConfirmModal()
  }


  const handleColumnTitleBlur = () => {

    if (columnTitle !== column.title) {

      const newColumn = {
        ...column,
        title : columnTitle
      }
      // Call API update column
      updateColumn(newColumn._id, newColumn).then(updatedColumn => {
        updatedColumn.cards = newColumn.cards
        onUpdateColumnState(updatedColumn)
      }).catch((error) => {
        toast.error(error.message)
      })
    }


  }

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      return
    }

    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim()
    }

    // Call API
    createNewCard(newCardToAdd).then(card => {
      let newColumn = cloneDeep(column)
      newColumn.cards.push(card)
      newColumn.cardOrder.push(card._id)

      onUpdateColumnState(newColumn)
      setNewCardTitle('')
      toogleOpenNewCardForm()
    }).catch((error) => {
      setNewCardTitle('')
      toogleOpenNewCardForm()
      toast.error(error.message)
    })

  }

  const onChangeToTask = (card) => {
    onCardClick(card)
    navigate(`card/${card._id}`)
  }

  return (
    <div className='columns'>
      <header className='column-drag-handle'>
        <div className='column-title'>
          <Form.Control
            className='trello-clone-content-editable'
            size="sm"
            type="text"
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineText}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onMouseDown={e => e.preventDefault()}
            onKeyDown={saveContentAfterPressEnter}
          />
        </div>
        <div className='column-dropdown-actions'>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" size='sm' className='dropdown-btn' />

            <Dropdown.Menu>
              <Dropdown.Item onClick={toogleOpenNewCardForm}>Add Card...</Dropdown.Item>
              <Dropdown.Item onClick={toogleShowConfirmModal}>Remove Column...</Dropdown.Item>
              <Dropdown.Item onClick={toggleDeleteCard}>Remove Card...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </header>
      <div className="card-list">
        <Container
          {...column.props}
          groupName="col"
          onDrop={dropResult => onCardDrop(column._id, dropResult)}
          getChildPayload={index =>
            cards[index]
          }
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'cards-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {
            cards.map((card, index) => (
              <Draggable key={index}>
                <Card 
                  card={card} 
                  onChangeToTask={onChangeToTask}
                  onCardDelete={onCardDelete}
                  deleteCard={deleteCard}
                  displayOptions={displayOptions} />
              </Draggable>)

            )
          }
        </Container>
        { openNewCardForm &&
          <div className='add_new_card_area'>
            <Form.Control
              className='textarea-enter-new-card'
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card..."
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              onKeyDown={e => (e.key === 'Enter' && addNewCard())}
            />
          </div>
        }

      </div>
      <footer>
        { openNewCardForm &&
          <div className='add_new_card_actions'>
            <Button variant="success" size='sm' onClick={addNewCard}>Add Card</Button>
            <span className='cancel-icon' onClick={toogleOpenNewCardForm}><i className='fa fa-trash icon'></i></span>
          </div>
        }

        { !openNewCardForm &&
          <div className='footer-actions' onClick={toogleOpenNewCardForm}>
            <i className='fa fa-plus icon' />Add another card
          </div>
        }
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`<strong>Are you sure you want to remove column ${column.title}</strong>`}
      />
    </div>

  )
}

export default Column