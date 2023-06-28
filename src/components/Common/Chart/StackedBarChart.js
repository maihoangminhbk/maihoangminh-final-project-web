import React from 'react'
import { Bar } from 'react-chartjs-2'

export const StackedBarChart = ({ chartData, title, description }) => {
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
            }
          },
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true
            }
          }
        }
        }

      />
    </div>
  )
}

export default StackedBarChart