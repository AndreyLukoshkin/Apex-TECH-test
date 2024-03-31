import './styles.css'

import React from 'react'
import ReactApexChart from 'react-apexcharts'

const CandlestickChart = ({ data }) => {
  const series = [
    {
      data: data.map((candle) => ({
        x: new Date(candle[0]),
        y: [
          parseFloat(candle[1]), // open
          parseFloat(candle[2]), // high
          parseFloat(candle[3]), // low
          parseFloat(candle[4]), // close
        ],
      })),
    },
  ]

  const options = {
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
  }

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={400}
        width={800}
      />
    </div>
  )
}

export default CandlestickChart
