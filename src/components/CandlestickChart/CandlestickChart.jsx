import './styles.css'
import React, { useEffect, useRef } from 'react'
import { ColorType, createChart } from 'lightweight-charts'
import { ArrWithTime } from '../../constants'
import { timeToLocal } from '../../helpers'

const CandlestickChart = ({ data, timeLabel }) => {
  const selectedTimeValue = ArrWithTime.filter(
    (el) => el.label === timeLabel
  )[0].value

  const chartContainerRef = useRef()

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#161a1e' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.parentElement.clientWidth,
      height: 400,
    })

    const candleStick = chart.addCandlestickSeries()

    candleStick.setData(
      data.slice(0, data.length - 1).map((candle) => {
        return {
          time: timeToLocal(candle[0]) / 1000, // converting from ms to s
          open: Number(candle[1]),
          high: Number(candle[2]),
          low: Number(candle[3]),
          close: Number(candle[4]),
        }
      })
    )

    const webSocketKlineCandleStick = new WebSocket(
      `wss://stream.binance.com:9443/ws/btcusdt@kline_${timeLabel}`
    )

    let lastCandle = null

    webSocketKlineCandleStick.onmessage = (ev) => {
      const res = JSON.parse(ev.data)
      const {
        E: time,
        k: { o: open, h: high, l: low, c: close },
      } = res

      // Преобразование времени из миллисекунд в секунды

      const currentTime = timeToLocal(time) / 1000

      // Если это первая свеча или прошло более 60 секунд с момента открытия текущей свечи
      if (!lastCandle || currentTime - lastCandle.time >= selectedTimeValue) {
        lastCandle = {
          time: currentTime,
          open: Number(open),
          high: Number(high),
          close: Number(close),
          low: Number(low),
        }

        // Обновляем свечу на графике
        candleStick.update(lastCandle)
      } else {
        // Обновляем цены последней свечи
        lastCandle.high = Math.max(lastCandle.high, Number(high))
        lastCandle.low = Math.min(lastCandle.low, Number(low))
        lastCandle.close = Number(close)

        // Обновляем свечу на графике
        candleStick.update(lastCandle)
      }
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      webSocketKlineCandleStick.close()
      chart.remove()
    }
  }, [data])

  return <div ref={chartContainerRef}></div>
}

export default CandlestickChart
