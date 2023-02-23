import React, { useState, useEffect, useRef } from 'react'

import { Outlet, useOutletContext, useParams } from 'react-router-dom'

import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { isEmpty, cloneDeep } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { useCallback } from 'react'
import { createBoard, fetchBoardDetails, createColumn, updateBoard, updateColumn, updateCard } from 'actions/APICall'
import { Bars } from 'react-loading-icons'
import { FaBars } from 'react-icons/fa'

import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

import { socketURL } from 'actions/socket/socket'

const boardSocket = io(socketURL.boardSocket)

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState({})
  const [boardIdSaved, setBoardIdSaved] = useState('')
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [clickedCard, setClickedCard] = useState({})

  const handleToggleSidebar = useOutletContext()
  const { boardId } = useParams()

  const toogleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const [newBoardTitle, setNewBoardTitle] = useState('')
  const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])
  const onNewBoardTitleChange = useCallback((e) => setNewBoardTitle(e.target.value), [])

  useEffect(() => {
    // const boardId = '62d92931b79a7a225262240a'
    // const boardId = localStorage.getItem('boardId')
    setBoardIdSaved(boardId)

    if (boardId) {
      const boardIdJson = boardId

      // const boardIdJson = JSON.parse(boardId)
      getBoardById(boardIdJson)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, clickedCard])

  // console.log('Vao user effext dau tien board content test')
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

  const handleOnColumnAdd = useCallback((column) => {

    let newColumns = [...columns]
    newColumns.push(column)


    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)

    toast.info('Other user add column!')
  }, [board, columns])

  const handleOnColumnDrop = useCallback((dropResult) => {
    let newColumns = cloneDeep(columns)
    newColumns = applyDrag(newColumns, dropResult)
    let newBoard = cloneDeep(board)
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns

    setBoard(newBoard)
    setColumns(newColumns)

    toast.info('Other user changed column!')

  }, [board, columns])

  const handleOnColumnUpdateState = useCallback((newColumnToUpdate) => {

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

    toast.info('Other user update column state!')

  }, [board, columns])

  const handleOnCardDrop = useCallback( (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns)

      let currentColumn = newColumns.find(c => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)

      setColumns(newColumns)

      let newBoard = { ...board }
      newBoard.columns = newColumns
      newBoard.columnOrder = newColumns.map(c => c._id)
      setBoard(newBoard)
    }
  }, [board, columns])

  useEffect(() => {
    console.log('SOCKET LISTEN')
    boardSocket.on('onColumnDrop', handleOnColumnDrop)
    boardSocket.on('onColumnAdd', handleOnColumnAdd)
    boardSocket.on('onColumnUpdateState', handleOnColumnUpdateState)
    boardSocket.on('onCardDrop', handleOnCardDrop)
    return () => {
      boardSocket.off('onColumnDrop')
      boardSocket.off('onColumnAdd')
      boardSocket.off('onColumnUpdateState')
      boardSocket.off('onCardDrop')
    }
  }, [handleOnColumnDrop, handleOnColumnAdd, handleOnColumnUpdateState, handleOnCardDrop])


  const createNewBoard = () => {
    const data = {
      title: newBoardTitle
    }
    console.log('TEST createNewBoard', newBoardTitle)
    createBoard(data).then(createdBoard => {
      console.log('baord content - createboard', createBoard)
      const createdBoardId = createdBoard._id
      console.log('createdBoardId', createdBoardId)
      localStorage.setItem('boardId', JSON.stringify(createdBoardId))
      setBoardIdSaved(createdBoard._id)
      getBoardById(createdBoardId)
    })

    // const createdBoard = createBoard(data)
    // console.log('createdBoard', createdBoard)
  }

  const getBoardById = async (boardId) => {

    await fetchBoardDetails(boardId).then(board => {
      console.log('board', board)
      setBoard(board)
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
      setBoardIdSaved(boardId)

    })
  }

  const boardNotFoundCase = () => {

    return (
      <div className='board-content'>
        <div className="not-found">Board not found!</div>
        <br></br>
        <div className='enter-new-column'>
          <Form.Control
            className='input-enter-new-column'
            size="sm" type="text"
            placeholder="Enter new board title..."
            // ref={newColumnInputRef}
            value={newBoardTitle}
            onChange={onNewBoardTitleChange}
            onKeyDown={e => (e.key === 'Enter' && createNewBoard())}
          />
          <Button variant="success" size='sm' onClick={createNewBoard}>Add Column</Button>
          {/* <span className='cancel-icon' onClick={toogleOpenNewColumnForm}><i className='fa fa-trash icon'></i></span> */}
        </div>
      </div>
    )


  }


  const onColumnDrop = (dropResult) => {
    console.log('dropResult', dropResult)
    let newColumns = cloneDeep(columns)
    console.log('newColumns', newColumns)
    newColumns = applyDrag(newColumns, dropResult)


    let newBoard = cloneDeep(board)
    newBoard.columnOrder = newColumns.map(c => c._id)
    newBoard.columns = newColumns

    setBoard(newBoard)
    setColumns(newColumns)

    // Call API update column order in board detail
    updateBoard(newBoard._id, { columnOrder: newBoard.columnOrder }).catch(() => {
      setColumns(columns)
      setBoard(board)
    }
    ).then(() => {
      boardSocket.emit('onColumnDrop', dropResult)
    })
  }


  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns)

      let currentColumn = newColumns.find(c => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)

      setColumns(newColumns)

      /**
       * Action: Move card inside its column
       * - Call API update card order
       */
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))


      } else {
        /**
         * Action: Move card between two columns
         * - Call API update card order
         * - Call API update column id in current card
         */
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))

        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload)
          currentCard.columnId = currentColumn._id

          // Call API update column id in current card
          updateCard(currentCard._id, currentCard)
        }


      }


      let newBoard = { ...board }
      newBoard.columns = newColumns
      newBoard.columnOrder = newColumns.map(c => c._id)
      setBoard(newBoard)

      boardSocket.emit('onCardDrop', columnId, dropResult)
    }
  }

  const onCardClick = (card) => {
    console.log('board content - card', card)
    setClickedCard(card)
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim()
    }


    // Call API
    createColumn(newColumnToAdd).then(column => {
      let newColumns = [...columns]
      newColumns.push(column)


      let newBoard = { ...board }
      newBoard.columnOrder = newColumns.map(c => c._id)
      newBoard.columns = newColumns
      setColumns(newColumns)
      setBoard(newBoard)
      setNewColumnTitle('')
      toogleOpenNewColumnForm()

      boardSocket.emit('onColumnAdd', column)
    }).catch((error) => {
      setNewColumnTitle('')
      toogleOpenNewColumnForm()
      toast.error(error.message)
    })


  }

  const onUpdateColumnState = (newColumnToUpdate) => {

    const columnIdToUpdate = newColumnToUpdate._id

    console.log('columnIdToUpdate', columnIdToUpdate)

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

    boardSocket.emit('onColumnUpdateState', newColumnToUpdate)

  }

  // console.log('boardIdSaved', boardIdSaved)
  // if (isEmpty(boardIdSaved)) {
  //   return boardNotFoundCase()
  // }

  if (isEmpty(board)) {
    return <Bars speed={1.} />
  }

  return (
    <div className="board-content">
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
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
        {columns instanceof Array && columns.map((column, index) => (

          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onCardClick={onCardClick}
              onUpdateColumnState={onUpdateColumnState}
            />
          </Draggable>
        ))
        }
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
      <Outlet context={{ clickedCard, setClickedCard }}/>
    </div>

  )
}

export default BoardContent

