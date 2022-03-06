import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { initialData } from 'actions/initialData'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { useCallback } from 'react'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState({})
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id = 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }
  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

  if (isEmpty(board)) {
    return <div className="not-found">Board not found!</div>
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)
    setColumns(newColumns)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
      let newBoard = { ...board }
      newBoard.columns = newColumns
      newBoard.columnOrder = newColumns.map(c => c.id)
      setBoard(newBoard)

    }
  }

  const toogleOpenNewColumnForm = () => {
    console.log(newColumnTitle)
    setOpenNewColumnForm(!openNewColumnForm)
  }
  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)
    setColumns(newColumns)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setBoard(newBoard)
    setNewColumnTitle('')
    toogleOpenNewColumnForm()

  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        dragHandleSelector=".column-drag-handle"
        getChildPayload={index => columns[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'columns-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className='trello-maihoangminh-container'>
        {!openNewColumnForm &&
        <Row>
          <Col className='add-new-column' onClick={toogleOpenNewColumnForm}>
            <i className='fa fa-plus icon' />Add another column
          </Col>
        </Row>
        }

        {openNewColumnForm &&
        <Row>
          <Col className='enter-new-column'>
            <Form.Control
              className='input-enter-new-column'
              size="sm" type="text"
              placeholder="Enter column title..."
              ref={newColumnInputRef}
              value={newColumnTitle}
              onChange={onNewColumnTitleChange}
              onKeyDown={e => (e.key === 'Enter' && addNewColumn())}
            />
            <Button variant="success" size='sm' onClick={addNewColumn}>Add Column</Button>
            <span className='cancle-new-column' onClick={toogleOpenNewColumnForm}><i className='fa fa-trash icon'></i></span>
          </Col>
        </Row>
        }

      </BootstrapContainer>
    </div>

  )
}

export default BoardContent

