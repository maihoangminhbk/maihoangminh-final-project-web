import React, { useEffect, useCallback } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'

import './Column.scss'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import { mapOrder } from 'utilities/sorts'
import { useState } from 'react'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'


function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

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
              <Dropdown.Item>Add Card...</Dropdown.Item>
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
      </div>
      <footer>
        <div className='footer-actions'>
          <i className='fa fa-plus icon' />Add another card
        </div>

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