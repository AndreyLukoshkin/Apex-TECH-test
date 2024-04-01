import './styles.css'
import React, { useEffect, useRef } from 'react'
import { ColorType, createChart } from 'lightweight-charts'

const CandlestickChart = ({ data }) => {
  const chartContainerRef = useRef()

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth })
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'black' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      width: 600,
      height: 400,
    })

    const candleStick = chart.addCandlestickSeries()

    candleStick.setData(
      data.map((candle) => {
        // console.log(candle[0])
        return {
          time: candle[0] / 1000,
          open: Number(candle[1]),
          high: Number(candle[2]),
          low: Number(candle[3]),
          close: Number(candle[4]),
        }
      })
    )

    const timeScale = chart.timeScale()

    timeScale.applyOptions({
      timeVisible: true,
      secondsVisible: false,
    })

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [data])

  return <div ref={chartContainerRef}></div>
}

export default CandlestickChart
