import './styles.css'
import React, { useEffect, useRef } from 'react'
import { ColorType, createChart } from 'lightweight-charts'
import { ArrWithTime } from '../../constants'
import { formatTimeStampToFullDate, timeToLocal } from '../../helpers'

const CandlestickChart = ({ data, timeLabel }) => {
  const selectedTimeValue = ArrWithTime.filter(
    (el) => el.label === timeLabel
  )[0].value

  const chartContainerRef = useRef()

  useEffect(() => {
    // create Chart
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

    // create series
    const candleStick = chart.addCandlestickSeries()

    // apply styles for series
    candleStick.applyOptions({
      upColor: 'rgb(12,203,129)',
      downColor: 'rgb(225, 50, 85)',
      borderVisible: false,
    })

    // setData for series
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

    // < ------------- add Markers --------------->

    const randomIndexes = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * data.length)
    )

    const datesForMarkers = randomIndexes
      .map((index) => data[index])
      .sort((a, b) => a[0] - b[0])

    let indexOfMinPriceArr = []

    for (let i = 1; i < datesForMarkers.length; i++) {
      if (datesForMarkers[i][2] < datesForMarkers[i - 1][2]) {
        indexOfMinPriceArr.push('lower')
      } else {
        indexOfMinPriceArr.push('higher')
      }
    }

    const markers = []
    for (let i = 0; i < datesForMarkers.length; i++) {
      const time1 = datesForMarkers[i][0]
      const time2 = datesForMarkers[i][6]
      const randomTime = Math.floor(Math.random() * (time2 - time1 + 1)) + time1

      if (indexOfMinPriceArr[i] === 'lower') {
        markers.push({
          time: timeToLocal(datesForMarkers[i][0]) / 1000,
          position: 'aboveBar',
          color: '#e91e63',
          shape: 'arrowDown',
          id: 'SELLID',
          text: `Sell $${Math.floor(
            datesForMarkers[i][2] + 2
          )} ${formatTimeStampToFullDate(randomTime)} Size: 3 BTC`,
        })
      } else {
        markers.push({
          time: timeToLocal(datesForMarkers[i][0]) / 1000,
          position: 'belowBar',
          color: '#0ccb81',
          shape: 'arrowUp',
          id: 'BUYID',
          text: `Buy $${Math.floor(
            datesForMarkers[i][3] - 2
          )} ${formatTimeStampToFullDate(randomTime)} Size: 3 BTC`,
        })
      }
    }
    document.getElementById('idBUY')
    candleStick.setMarkers(markers)

    // < --------------------------------------->

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

      const currentTime = timeToLocal(time) / 1000

      // If this is the first candle or more than 60 seconds have passed since the current candle was opened
      if (!lastCandle || currentTime - lastCandle.time >= selectedTimeValue) {
        lastCandle = {
          time: currentTime,
          open: Number(open),
          high: Number(high),
          close: Number(close),
          low: Number(low),
        }

        // Updating the candle on the chart
        candleStick.update(lastCandle)
      } else {
        //  Updating the prices of the last candle
        lastCandle.high = Math.max(lastCandle.high, Number(high))
        lastCandle.low = Math.min(lastCandle.low, Number(low))
        lastCandle.close = Number(close)

        // Updating the candle on the chart
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
