import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import events from './events'
import { Dropdown, Container, ProgressBar, Row, Col, Nav, Navbar, NavDropdown, Form } from 'react-bootstrap'
import DropdownButton from 'react-bootstrap/DropdownButton'

import { getCalendarCards, getWorkplace } from 'actions/APICall'


import './TaskCalendar.scss'

const localizer = momentLocalizer(moment)

export default function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState([])
  const [boardList, setBoardList] = useState([])
  const [boardListFilter, setBoardListFilter] = useState([])
  const [checked, setChecked] = useState(true)

  const { workplaceId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getWorkplace(workplaceId).then(workplace => {
      setBoardList(workplace.boardOrder)

      const newBoardListFilter = workplace.boardOrder.map(board => (board.boardId))
      setBoardListFilter(newBoardListFilter)
    }
    )
  }, [workplaceId])

  useEffect(() => {
    if (workplaceId && boardListFilter && boardListFilter.length >= 0) {

      const data = {
        workplaceId: workplaceId,
        boardList: boardListFilter
      }

      getCalendarCards(data).then(resultArray => {
        const convertData = resultArray.map(result => (
          {
            id: result._id,
            title: result.title,
            start: new Date(result.startTime),
            end: new Date(result.endTime)
          }
        ))

        setEventsData(convertData)
      })
    }

  }, [workplaceId, boardListFilter])

  useEffect(() => {
    console.log('board list filter', boardListFilter)
  }, [boardListFilter])

  // const handleSelect = ({ start, end }) => {
  //   console.log(start)
  //   console.log(end)
  //   const title = window.prompt('New Event name')
  //   if (title)
  //     setEventsData([
  //       ...eventsData,
  //       {
  //         start,
  //         end,
  //         title
  //       }
  //     ])
  // }

  const onCheckboxChange = (e) => {
    if (e.target.checked) {
      const newBoardListFilter = [
        ...boardListFilter
      ]

      newBoardListFilter.push(e.target.id)
      setBoardListFilter(newBoardListFilter)
    } else {
      const newBoardListFilter = [
        ...boardListFilter
      ]

      const index = newBoardListFilter.indexOf(e.target.id)
      if (index > -1) { // only splice array when item is found
        newBoardListFilter.splice(index, 1) // 2nd parameter means remove one item only
      }

      setBoardListFilter(newBoardListFilter)
    }
  }

  const onSelectEvent = (event) => {
    navigate(`card/${event.id}`)
  }

  return (
    <div className="task-calendar">
      <Container className='calendar-container'>
        <Row className='control-row'>
          <Navbar className='calendar-navbar' expand="sm">
            <Container fluid>
              <Navbar.Brand>Calendar</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse>
                <Nav>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="Board"
                    menuVariant="white"
                  >
                    { boardList.map(board => (
                      <Form.Check
                        key={board.boardId}// prettier-ignore
                        type={'checkbox'}
                        id={board.boardId}
                        label={board.title}
                        defaultChecked={true}
                        onChange={e => onCheckboxChange(e)}
                        // onClick={e => onCheckboxClick(e)}
                      />
                    )
                    )}
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Row>

        <Row className='calendar-row'>
          <Calendar
            className='calendar'
            views={['day', 'agenda', 'work_week', 'month']}
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={eventsData}
            onSelectEvent={(event) => onSelectEvent(event)}
            // onSelectSlot={handleSelect}
          />
        </Row>
      </Container>
      <Outlet />
    </div>
  )
}