import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, Table, Button, InputGroup, FormControl } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'

import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Data } from 'utilities/Data'
import DatePicker from 'react-datepicker'

import './BoardDashBoard.scss'
import PieChart from 'components/Common/Chart/PieChart'
import BarChart from 'components/Common/Chart/BarChart'
import StackedBarChart from 'components/Common/Chart/StackedBarChart'

import { dashboardGetCardsStatusStatistic, dashboardGetTasksStatusStatistic, dashboardGetBoardStatistic, dashboardGetTasksStatusInYearStatistic, getWorkplace, dashboardGetUsersInfoStatistic } from 'actions/APICall'
import { GiConsoleController } from 'react-icons/gi'
import { FaRegCalendarAlt } from 'react-icons/fa'
import Spinner from 'react-bootstrap/Spinner'

import InfiniteScroll from 'react-infinite-scroll-component'

import { isEqual } from 'lodash'

import minhMaiAvatar from 'actions/images/userAvatar.png'

import { userList as userListInit } from './data'


Chart.register(CategoryScale)

function DashBoard() {
  const [cardNumber, setCardNumber] = useState(0)
  const [taskNumber, setTaskNumber] = useState(0)
  const [userNumber, setUserNumber] = useState(0)

  const [cardsStatusChart, setCardsStatusChart] = useState()

  const [tasksStatusChart, setTasksStatusChart] = useState()

  const [boardTasksStateChart, setBoardTasksStateChart] = useState()

  const [boardList, setBoardList] = useState([])

  const [selectedBoard, setSelectedBoard] = useState()

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const [userList, setUserList] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [userListPage, setUserListPage] = useState(1)

  const { workplaceId } = useParams()

  useEffect(() => {
    getWorkplace(workplaceId).then(workplace => {
      setBoardList(workplace.boardOrder)
      if (workplace.boardOrder[0]) {
        setSelectedBoard(workplace.boardOrder[0].boardId)
      }
    }
    )
  }, [workplaceId])

  useEffect(() => {
    if (selectedBoard) {
      dashboardGetBoardStatistic(selectedBoard).then(result => {
        setCardNumber(result.cardCount)
        setTaskNumber(result.taskCount)
        setUserNumber(result.userCount)
      })
    }
  }, [selectedBoard])

  useEffect(() => {
    let convertedStartDate = startDate
    let convertedEndDate = endDate

    if (startDate) {
      convertedStartDate = startDate.getTime()
    }

    if (endDate) {
      convertedEndDate = endDate.getTime()
    }

    if (selectedBoard) {
      dashboardGetCardsStatusStatistic(selectedBoard, convertedStartDate, convertedEndDate).then(result => {
        const chartData = {
          labels: ['created', 'inprocess', 'done', 'completed', 'late', 'cancel'],
          datasets: [
            {
              label: 'Number of cards',
              data: [result.created, result.inprocess, result.done, result.completed, result.late, result.cancel],
              backgroundColor: [
                'rgb(225, 223, 223)',
                'yellow',
                'blue',
                'green',
                'red',
                'orange'
              ],
              borderColor: 'black',
              borderWidth: 0.5
            }
          ]
        }
        setCardsStatusChart(chartData)
      })
    }
  }, [endDate, selectedBoard, startDate])

  useEffect(() => {
    let convertedStartDate = startDate
    let convertedEndDate = endDate

    if (startDate) {
      convertedStartDate = startDate.getTime()
    }

    if (endDate) {
      convertedEndDate = endDate.getTime()
    }

    if (selectedBoard) {
      dashboardGetTasksStatusStatistic(selectedBoard, convertedStartDate, convertedEndDate).then(result => {
        const chartData = {
          labels: ['created', 'inprocess', 'done', 'completed', 'late', 'cancel'],
          datasets: [
            {
              label: 'Number of tasks',
              data: [result.created, result.inprocess, result.done, result.completed, result.late, result.cancel],
              backgroundColor: [
                'rgb(225, 223, 223)',
                'yellow',
                'blue',
                'green',
                'red',
                'orange'
              ],
              borderColor: 'black',
              borderWidth: 0.5
            }
          ]
        }
        setTasksStatusChart(chartData)
      })
    }

  }, [endDate, selectedBoard, startDate])

  useEffect(() => {
    let year
    const currentYear = new Date().getFullYear()

    if (startDate) {
      year = startDate.getFullYear()
    } else {
      year = currentYear
    }

    setSelectedYear(year)

    if (selectedBoard) {
      dashboardGetTasksStatusInYearStatistic(selectedBoard, year).then(result => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const testData = labels.map((month, index) => {
          const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 2))
          if (obj) {
            return obj.count
          } else {
            return 0
          }
        })

        const chartData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Created',
              data: labels.map((month, index) => {
                const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 0))
                if (obj) {
                  return obj.count
                } else {
                  return 0
                }
              }),
              backgroundColor: 'rgb(225, 223, 223)',
              borderColor: 'black',
              borderWidth: 0.5
            },
            {
              label: 'Inprocess',
              data: labels.map((month, index) => {
                const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 1))
                if (obj) {
                  return obj.count
                } else {
                  return 0
                }
              }),
              backgroundColor: 'yellow',
              borderColor: 'black',
              borderWidth: 0.5
            },
            {
              label: 'Done',
              data: labels.map((month, index) => {
                const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 2))
                if (obj) {
                  return obj.count
                } else {
                  return 0
                }
              }),
              backgroundColor: 'blue',
              borderColor: 'black',
              borderWidth: 0.5
            },
            {
              label: 'Completed',
              data: labels.map((month, index) => {
                const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 3))
                if (obj) {
                  return obj.count
                } else {
                  return 0
                }
              }),
              backgroundColor: 'green',
              borderColor: 'black',
              borderWidth: 0.5
            },
            {
              label: 'Late',
              data: labels.map((month, index) => {
                const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 4))
                if (obj) {
                  return obj.count
                } else {
                  return 0
                }
              }),
              backgroundColor: 'red',
              borderColor: 'black',
              borderWidth: 0.5
            },
            {
              label: 'Cancel',
              data: labels.map((month, index) => {
                const obj = result.find(obj => (obj._id.month === index + 1 && obj._id.status === 5))
                if (obj) {
                  return obj.count
                } else {
                  return 0
                }
              }),
              backgroundColor: 'orange',
              borderColor: 'black',
              borderWidth: 0.5
            }
          ]
        }

        setBoardTasksStateChart(chartData)
      })
    }

  }, [selectedBoard, startDate])

  useEffect(() => {
    setUserListPage(1)

    if (selectedBoard) {
      dashboardGetUsersInfoStatistic(selectedBoard, userSearch, 1).then(result => {
        if (result && result.length === 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        let convertedResult = []

        result.map(user => {
          user.created = 0
          user.inprocess = 0
          user.done = 0
          user.completed = 0
          user.late = 0
          user.cancel = 0
          let key

          switch (user._id.status) {
          case 0:
            user.created = user.taskCount
            key = 'created'
            break
          case 1:
            user.inprocess = user.taskCount
            key = 'inprocess'
            break
          case 2:
            user.done = user.taskCount
            key = 'done'
            break
          case 3:
            user.completed = user.taskCount
            key = 'completed'
            break
          case 4:
            user.late = user.taskCount
            key = 'late'
            break
          case 5:
            user.cancel = user.taskCount
            key = 'cancel'
            break

          default:
            break
          }

          delete user._id.status

          const findResult = convertedResult.find(obj => isEqual(obj._id, user._id))
          if (findResult) {
            findResult[key] = user.taskCount
            findResult.taskCount = findResult.taskCount + user.taskCount
          } else {
            convertedResult.push(user)
          }

        })

        if (convertedResult.length < 3) {
          setHasMore(false)
        }
        setUserList(convertedResult)

      }
      )
    }
  }, [selectedBoard, userSearch])

  const onBoardSellect = (e) => {
    setSelectedBoard(e.target.value)
  }

  const onUserSearchChange = (e) => {
    // console.log('user search', userSearch)
    setUserSearch(e.target.value)
  }

  const fetchMoreUserData = () => {

    dashboardGetUsersInfoStatistic(selectedBoard, userSearch, userListPage + 1).then(result => {
      if (result && result.length == 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
        let convertedResult = []

        result.map(user => {
          user.created = 0
          user.inprocess = 0
          user.done = 0
          user.completed = 0
          user.late = 0
          user.cancel = 0

          switch (user._id.status) {
          case 0:
            user.created = user.taskCount
            break
          case 1:
            user.inprocess = user.taskCount
            break
          case 2:
            user.done = user.taskCount
            break
          case 3:
            user.completed = user.taskCount
            break
          case 4:
            user.late = user.taskCount
            break
          case 5:
            user.cancel = user.taskCount
            break

          default:
            break
          }

          delete user._id.status

          const findResult = convertedResult.find(obj => isEqual(obj._id, user._id))
          if (findResult) {
            const key = Object.keys(user)[2]
            findResult[key] = user.taskCount
            findResult.taskCount = findResult.taskCount + user.taskCount
          } else {
            // delete user.taskCount
            convertedResult.push(user)
          }

          // user.name = user._id.name
          // user.status = user._id.status
          // user.email = user._id.email
          // user.cover = user._id.cover

        })
        setUserList(convertedResult)
        const newUserList = [
          ...userList,
          ...convertedResult
        ]
        // console.log('newUserSearchList', newUserBoardList)
        setUserList(newUserList)
        setUserListPage(userListPage + 1)

      }

    })

  }

  return (
    <div className='board-dashboard'>
      <Navbar className="navbar" expand="sm">
        {/* <BootstrapContainer> */}
        <Navbar.Brand className="board-navbar-brand">
             Board Filter
        </Navbar.Brand>
        <Navbar.Toggle className="board-navbar-toggle" aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="board-navbar-collapse" id="basic-navbar-nav">
          <div className='nav-item'>
            <Form.Select
              aria-label="Board select"
              value={selectedBoard}
              onChange={onBoardSellect}
            >
              <option value=''>Sellect board</option>
              {
                boardList.map((board, index) => {
                  return <option key={index} value={board.boardId}>{board.title}</option>
                })
              }
            </Form.Select>
          </div>

          <div className='nav-item'>
            <div className='item-name'>
              <FaRegCalendarAlt className='icon'/>
            Start Time
            </div>
            <div className='item-content'>
              <DatePicker
                selected={startDate}
                selectsStart
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                startDate={startDate}
                endDate={endDate}
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
          </div>

          <div className='nav-item'>
            <div className='item-name'>
              <FaRegCalendarAlt className='icon'/>
              End Time
            </div>
            <div className='item-content'>
              <DatePicker
                selected={endDate}
                selectsEnd
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </div>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Row className='dashboard-row'>
        <Col lg sm={3} className='workplace-status area square-area'>
          <Row className='first-row'>
            <Col lg={6} sm={9} className='value'>
              {cardNumber}
            </Col>
            <Col lg={2} className='unit'>
      Cards
            </Col>
          </Row>
          <Row className='second-row'>
            <Col lg={6} sm={9} className='value'>
              {taskNumber}
            </Col>
            <Col lg={2} className='unit'>
      Tasks
            </Col>
          </Row>
          <Row className='third-row'>
            <Col lg={6} sm={9} className='value'>
              {userNumber}
            </Col>
            <Col lg={2} className='unit'>
      Users
            </Col>
          </Row>
        </Col>
        <Col lg sm={3} className='area square-area'>
          { cardsStatusChart &&
      <PieChart
        chartData={cardsStatusChart}
        title='Card status'
        description='Number of Card status in workplace' />
          }
        </Col>

        <Col lg sm={6} className='area rectangle-area'>
          { tasksStatusChart &&
      <BarChart
        chartData={tasksStatusChart}
        title='Task status'
        description='Number of tasks with task status'
      />
          }
        </Col>
      </Row>
      <Row className='dashboard-row'>
        <Col lg sm={6} className='area rectangle-area'>
          { boardTasksStateChart &&
          <StackedBarChart
            chartData={boardTasksStateChart}
            title='Tasks status'
            description={`Number of tasks status  by month in boards ${selectedYear}`}
          />
          }
        </Col>
      </Row>
      <Row className='dashboard-row'>
        <Col lg sm={6} className='area rectangle-area'>
          <Row className='table-title text-center'>
            <div className='text'>User List</div>
          </Row>
          <Row className='table-content'>
            <Row className='user-form-row'>
              <div className='item search'>
                <Form.Group>
                  <InputGroup className='group-search'>
                    <FormControl
                      className='input-search'
                      placeholder='Search user in board'
                      type='text'
                      value={userSearch}
                      onChange={onUserSearchChange}
                      // onKeyDown={e => (e.key === 'Enter' && toogleShowAddUserConfirmModal())}
                    />
                    <InputGroup.Text className='input-icon-search'><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text>

                  </InputGroup>
                </Form.Group>
              </div>
            </Row>
            <div className='user-list-row'>
              <div id="scrollableDiv" className='scrollableDiv'>
                <InfiniteScroll
                  dataLength={userList.length}
                  next={fetchMoreUserData}
                  hasMore={hasMore}
                  loader=<Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  scrollableTarget="scrollableDiv"
                  // height={200}
                  endMessage={
                    <p style={{ textAlign: 'center' }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  <Table striped hover responsive='sm' size="sm" className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Completed</th>
                        <th>Created</th>
                        <th>In process</th>
                        <th>Done</th>
                        <th>Late</th>
                        <th>Cancel</th>
                      </tr>
                    </thead>


                    <tbody>

                      { userList.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <div className='item user-avatar user-avatar-dropdown' >
                              <img src={user._id.cover === null ? minhMaiAvatar : user._id.cover} />
                              { user._id.name}
                            </div>

                          </td>
                          <td><p className='table-data'>{ user._id.email }</p></td>
                          <td><p className='table-data badge'>{user.completed}/{user.taskCount}</p></td>
                          <td><p className='table-data badge created'>{user.created}</p></td>
                          <td><p className='table-data badge inprocess'>{user.inprocess}</p></td>
                          <td><p className='table-data badge done'>{user.done}</p></td>
                          <td><p className='table-data badge late'>{user.late}</p></td>
                          <td><p className='table-data badge cancel'>{user.cancel}</p></td>
                        </tr>

                      )

                      )}
                    </tbody>
                  </Table>
                </InfiniteScroll>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default DashBoard