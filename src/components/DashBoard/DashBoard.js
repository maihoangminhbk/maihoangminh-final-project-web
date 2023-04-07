import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Data } from 'utilities/Data'

import './DashBoard.scss'
import PieChart from 'components/Common/Chart/PieChart'
import BarChart from 'components/Common/Chart/BarChart'

Chart.register(CategoryScale)

function DashBoard() {
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: 'Users Gained ',
        data: Data.map((data) => data.userGain),
        backgroundColor: [
          'rgba(75,192,192,1)',
          '#ecf0f1',
          '#50AF95',
          '#f3ba2f',
          '#2a71d0'
        ],
        borderColor: 'black',
        borderWidth: 2
      }
    ]
  })

  const [taskNumber, setTaskNumber] = useState(10)
  const [userNumber, setUserNumber] = useState(1000)

  return (
    <Container className='dashboard-container'>
      <Row className='dashboard-row'>
        <Col lg sm={3} className='area square-area'>
          <PieChart chartData={chartData} />
        </Col>
        <Col lg sm={3} className='area square-area'>
          <Row className='first-row'>
            <Col lg sm={10} className='value'>
              {taskNumber}
            </Col>
            <Col className='unit'>
              Tasks
            </Col>
          </Row>
          <Row className='second-row'>
            <Col lg sm={10} className='value'>
              {userNumber}
            </Col>
            <Col className='unit'>
              Users
            </Col>
          </Row>
        </Col>
        <Col lg sm={6} className='area rectangle-area'>
          <BarChart chartData={chartData} />

        </Col>
      </Row>
      <Row className='dashboard-row'>
        <Col lg sm={6} className='area rectangle-area'>
          <BarChart chartData={chartData} />

        </Col>
      </Row>
    </Container>
  )
}

export default DashBoard