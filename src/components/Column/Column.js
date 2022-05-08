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


function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

  const [openNewCardForm, setOpenNewCardForm] = useState(false)

  const newCardTextareaRef = useRef(null)

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = useCallback((e) => setNewCardTitle(e.target.value), [])

  const toogleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
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
    console.log(type)

    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy : true
      }

      onUpdateColumn(newColumn)

    }
    toogleShowConfirmModal()
  }


  const handleColumnTitleBlur = () => {
    console.log(columnTitle)

    const newColumn = {
      ...column,
      title : columnTitle
    }

    onUpdateColumn(newColumn)
  }

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      return
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: column.id,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover : null
    }

    console.log(column)

    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)

    console.log(newColumn)
    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toogleOpenNewCardForm()
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
              <Dropdown.Item>Remove Card...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </header>
      <div className="card-list">
        <Container
          {...column.props}
          groupName="col"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
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
                <Card card={card} />
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