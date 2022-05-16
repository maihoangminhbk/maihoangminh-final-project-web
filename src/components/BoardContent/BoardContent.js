import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { useCallback } from 'react'
import { fetchBoardDetails } from 'actions/APICall'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState({})
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toogleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])


  useEffect(() => {
    const boardId = '627f6e4204994af3b43a899f'
    fetchBoardDetails(boardId).then(board => {

      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
      setBoard(board)
    })

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
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find(c => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)

      setColumns(newColumns)
      let newBoard = { ...board }
      newBoard.columns = newColumns
      newBoard.columnOrder = newColumns.map(c => c._id)
      setBoard(newBoard)

    }
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board._id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    toogleOpenNewColumnForm()

  }

  const onUpdateColumn = (newColumnToUpdate) => {

    const columnIdToUpdate = newColumnToUpdate._id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate)

    if (newColumnToUpdate._destroy) {
      //  Remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      //  Update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
    console.log(newColumns)

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
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
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
            <span className='cancel-icon' onClick={toogleOpenNewColumnForm}><i className='fa fa-trash icon'></i></span>
          </Col>
        </Row>
        }

      </BootstrapContainer>
    </div>

  )
}

export default BoardContent

