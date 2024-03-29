import React from 'react'
import { Bar } from 'react-chartjs-2'

export const BarChart = ({ chartData, title, description }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: description
            },
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: true,
                  steps: 10,
                  stepValue: 1,
                  // max: 100
                  min: 1
                }
              }]
            }
          }
        }}
      />
    </div>
  )
}

export default BarChart