import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

import { Container, Row, Col, Navbar } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'

import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Data } from 'utilities/Data'
import BoardDashBoard from './BoardDashBoard'

import './DashBoard.scss'
import PieChart from 'components/Common/Chart/PieChart'
import BarChart from 'components/Common/Chart/BarChart'
import StackedBarChart from 'components/Common/Chart/StackedBarChart'

import { dashboardGetCardsStatusFullStatistic, dashboardGetTasksStatusFullStatistic, dashboardGetWorkplaceStatistic, dashboardGetWorkplaceUserCountStatistic, dashboardGetTasksStatusInYearStatistic } from 'actions/APICall'
import { GiConsoleController } from 'react-icons/gi'

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

// const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => Math.random()),
//       backgroundColor: 'rgb(255, 99, 132)'
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => Math.random()),
//       backgroundColor: 'rgb(75, 192, 192)'
//     },
//     {
//       label: 'Dataset 3',
//       data: labels.map(() => Math.random()),
//       backgroundColor: 'rgb(53, 162, 235)'
//     }
//   ]
// }

Chart.register(CategoryScale)

function DashBoard() {
  // const [cardsStatusFullStatistic, setCardsStatusFullStatistic] = useState()
  const [cardNumber, setCardNumber] = useState(0)
  const [taskNumber, setTaskNumber] = useState(0)
  const [userNumber, setUserNumber] = useState(0)

  const [cardsStatusFullChart, setCardsStatusFullChart] = useState()

  const [tasksStatusFullChart, setTasksStatusFullChart] = useState()

  const [boardUserChart, setBoardUserChart] = useState()

  const [boardTasksStateChart, setBoardTasksStateChart] = useState()

  const { workplaceId } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    dashboardGetCardsStatusFullStatistic(workplaceId).then(result => {
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

      setCardsStatusFullChart(chartData)
    })
  }, [workplaceId])

  useEffect(() => {
    dashboardGetWorkplaceStatistic(workplaceId).then(result => {
      setCardNumber(result.cardCount)
      setTaskNumber(result.taskCount)
      setUserNumber(result.userCount)
    })
  }, [workplaceId])

  useEffect(() => {
    dashboardGetTasksStatusFullStatistic(workplaceId).then(result => {
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

      setTasksStatusFullChart(chartData)
    })
  }, [workplaceId])

  useEffect(() => {
    dashboardGetWorkplaceUserCountStatistic(workplaceId).then(result => {
      const chartData = {
        labels: result.map(board => board.title),
        datasets: [
          {
            label: 'Number of users in boards',
            data: result.map(board => board.count),
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

      setBoardUserChart(chartData)
    })
  }, [workplaceId])

  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: 'Users Gained ',
        data: Data.map((data) => data.userGain),
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
  })

  return (
    <div className='dashboard'>

      <Container className='dashboard-container'>
        <Accordion defaultActiveKey="0">
          { !user.role &&
          <Accordion.Item eventKey="0">
            <Accordion.Header>Workplace Dashboard</Accordion.Header>
            <Accordion.Body>
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
                  { cardsStatusFullChart &&
              <PieChart
                chartData={cardsStatusFullChart}
                title='Card status'
                description='Number of Card status in workplace' />
                  }
                </Col>

                <Col lg sm={6} className='area rectangle-area'>
                  { tasksStatusFullChart &&
              <BarChart
                chartData={tasksStatusFullChart}
                title='Task status'
                description='Number of tasks with task status'
              />
                  }
                </Col>
              </Row>
              <Row className='dashboard-row'>
                <Col lg sm={6} className='area rectangle-area'>
                  { boardUserChart &&
              <BarChart
                chartData={boardUserChart}
                title='Boards users'
                description='Number of users in boards'
              />
                  }
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          }
          { !!user.role &&
          <Accordion.Item eventKey="1">
            <Accordion.Header>Board Dashboard</Accordion.Header>
            <Accordion.Body>
              <BoardDashBoard />
            </Accordion.Body>
          </Accordion.Item>
          }
        </Accordion>
      </Container>
    </div>
  )
}

export default DashBoard