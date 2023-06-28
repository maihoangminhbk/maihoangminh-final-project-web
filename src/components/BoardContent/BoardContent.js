import React, { useState, useEffect, useRef } from 'react'

import { Outlet, useOutletContext, useParams } from 'react-router-dom'

import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { isEmpty, cloneDeep } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { Container as BootstrapContainer, Row, Col, Form, Button, Nav, Navbar, NavDropdown, Dropdown, InputGroup, FormControl } from 'react-bootstrap'
import { useCallback } from 'react'
import { createBoard, fetchBoardDetails, createColumn, updateBoard, updateColumn, updateCard } from 'actions/APICall'
import { Bars } from 'react-loading-icons'
import { FaBars } from 'react-icons/fa'
import { AiFillStar, AiOutlineFilter } from 'react-icons/ai'
import { RiSlackFill, RiDeleteBin6Fill } from 'react-icons/ri'
import { MdOutlinePersonAddAlt } from 'react-icons/md'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import ConfirmModal from 'components/Common/ConfirmModal'

import CustomToggle from 'components/Common/CustomToggle'
// import Notification from 'components/Notification/Notification'


import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

import { socketURL } from 'actions/socket/socket'
import minhMaiAvatar from 'actions/images/userAvatar.png'
import { isReturningJSX } from 'eslint-plugin-react/lib/util/jsx'
import BoardNav from 'components/BoardNav/BoardNav'


const boardSocket = io(socketURL.boardSocket)


const userListInit = [
  { _id: '1',
    name: 'Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai Minh Mai',
    email: 'minh@gmail.com',
    cover: 'https://picsum.photos/90',
    role: 1
  },

  { _id: '2',
    name: 'Anh Mai',
    cover: 'https://picsum.photos/91',
    email: 'minh12@gmail.com',
    role: 0
  },

  { _id: '3',
    name: 'Mai Van B',
    cover: 'https://picsum.photos/92',
    email: 'anh@gmail.com',
    role: 1
  },
  { _id: '4',
    name: 'Nguyen Van A',
    cover: 'https://picsum.photos/90',
    email: 'van@gmail.com',
    role: 1
  },

  { _id: '5',
    name: 'Minh mai',
    cover: 'https://picsum.photos/91',
    email: 'toi@gmail.com',
    role: 0
  },

  { _id: '6',
    name: 'Nay day',
    cover: 'https://picsum.photos/92',
    email: 'nay@gmail.com',
    role: 1
  }
]

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState({})
  const [boardIdSaved, setBoardIdSaved] = useState('')
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [clickedCard, setClickedCard] = useState({})
  const [likeBoard, setLikeBoard] = useState(false)
  const [userList, setUserList] = useState(userListInit)
  const [userListFilter, setUserListFilter] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState(0)
  const [addUserMode, setAddUserMode] = useState(false)
  const [showAddUserConfirmModal, setShowAddUserConfirmModal] = useState(false)
  const toogleShowAddUserConfirmModal = () => setShowAddUserConfirmModal(!showAddUserConfirmModal)

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

      boardSocket.emit('onJoinBoard', boardId)
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
    createBoard(data).then(createdBoard => {
      const createdBoardId = createdBoard._id
      localStorage.setItem('boardId', JSON.stringify(createdBoardId))
      setBoardIdSaved(createdBoard._id)
      getBoardById(createdBoardId)
    })

    // const createdBoard = createBoard(data)
    // console.log('createdBoard', createdBoard)
  }

  const getBoardById = async (boardId) => {

    await fetchBoardDetails(boardId).then(board => {
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
    let newColumns = cloneDeep(columns)
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
      boardSocket.emit('onColumnDrop', boardId, dropResult)
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

      boardSocket.emit('onCardDrop', boardId, columnId, dropResult)
    }
  }

  const onCardClick = (card) => {
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

      boardSocket.emit('onColumnAdd', boardId, column)
    }).catch((error) => {
      setNewColumnTitle('')
      toogleOpenNewColumnForm()
      toast.error(error.message)
    })


  }

  const onUpdateColumnState = (newColumnToUpdate) => {

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

    updateBoard(newBoard._id, { columnOrder: newBoard.columnOrder }).catch(() => {
      setColumns(columns)
      setBoard(board)
    }
    ).then(() => {
      boardSocket.emit('onColumnUpdateState', boardId, newColumnToUpdate)
    })
  }

  const onCardDelete = (card) => {
    let newColumns = cloneDeep(columns)

    let currentColumn = newColumns.find(c => c._id === card.columnId)

    const cards = currentColumn.cards

    const cardIndexToUpdate = cards.findIndex(i => i._id === card._id)

    cards.splice(cardIndexToUpdate, 1)

    currentColumn.cards = cards

    currentColumn.cardOrder = cards.map(c => c._id)

    const currentCard = {
      ...card,
      _destroy: true
    }

    updateCard(currentCard._id, currentCard).catch((error) => {
      toast.error(error.message)
    }).then(
      onUpdateColumnState(currentColumn)
    )
  }

  // console.log('boardIdSaved', boardIdSaved)
  // if (isEmpty(boardIdSaved)) {
  //   return boardNotFoundCase()
  // }

  if (isEmpty(board)) {
    return <Bars speed={1.} />
  }

  const onAddUserConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      // addNewUser()


    }
    toogleShowAddUserConfirmModal()
  }

  return (
    <div className="board-container">
      <div className="board-nav">
        <BoardNav
          board={board}
        />
      </div>

      <div className="board-content">
        {/* <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div> */}
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
                onCardDelete={onCardDelete}
                onUpdateColumnState={onUpdateColumnState}
              />
            </Draggable>
          ))
          }
        </Container>

        <BootstrapContainer className='trello-maihoangminh-container'>
          {!openNewColumnForm &&
        <Row className="add-new-column-row">
          <Col className='add-new-column' onClick={toogleOpenNewColumnForm}>
            <i className='fa fa-plus icon' />Add another column
          </Col>
        </Row>
          }

          {openNewColumnForm &&
        <Row className="add-new-column-row">
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
          <ConfirmModal
            show={showAddUserConfirmModal}
            onAction={onAddUserConfirmModalAction}
            title="Add user"
            content={`Are you sure you want add user <strong>${userEmail}</strong> with <strong>${userRole === 1 ? 'admin' : 'user'}</strong> permission?`}
          />

        </BootstrapContainer>
        <Outlet context={{ clickedCard, setClickedCard }}/>
      </div>
    </div>

  )
}

export default BoardContent

