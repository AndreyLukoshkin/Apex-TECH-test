import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import axios from 'axios'
import { ColorType, createChart } from 'lightweight-charts'

const ChartPackage = () => {
  const [time, setTime] = useState('1m')
  const [data, setData] = useState([])
  const [price, setPrice] = useState('')
  const [prevPrice, setPrevPrice] = useState('')
  const [color, setColor] = useState('')
  const [selectedTimeValue, setSelectedTimeValue] = useState(60)
  const chartContainerRef = useRef()
  const [chartWasCreated, setChartWasCreated] = useState(false)

  // console.log(data)

  const timeToLocal = (time) => {
    const utcTimestamp = time
    const date = new Date(utcTimestamp)
    const localTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
    return localTime.getTime()
  }

  const formatTimeStampToFullDate = (timestamp) => {
    const date = new Date(timestamp)
    const localTime = new Date(date.getTime() - date.getTimezoneOffset())
    const formattedDate = `${localTime.getDate()}.${
      localTime.getMonth() + 1
    }.${localTime.getFullYear()} ${localTime.getHours()}:${
      localTime.getMinutes() < 10 ? '0' : ''
    }${localTime.getMinutes()}`
    return formattedDate
  }

  const ArrWithTime = [
    { label: '1m', value: 60 },
    { label: '3m', value: 3 * 60 },
    { label: '5m', value: 5 * 60 },
    { label: '15m', value: 15 * 60 },
    { label: '30m', value: 30 * 60 },
    { label: '1h', value: 60 * 60 },
    { label: '2h', value: 2 * 60 * 60 },
    { label: '4h', value: 4 * 60 * 60 },
    { label: '6h', value: 6 * 60 * 60 },
    { label: '8h', value: 8 * 60 * 60 },
    { label: '12h', value: 12 * 60 * 60 },
    { label: '1d', value: 24 * 60 * 60 },
    { label: '3d', value: 3 * 24 * 60 * 60 },
    { label: '1w', value: 7 * 24 * 60 * 60 },
    { label: '1M', value: 30 * 24 * 60 * 60 }, // Approximation of 1 month
  ]

  const handleTime = (event) => {
    setTime(event.target.value)
  }

  useEffect(() => {
    setSelectedTimeValue(ArrWithTime.filter((el) => el.label === time)[0].value)
  }, [time])

  // BINANCE

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${time}`
        )
        const data = response.data
        setData(data)
      } catch (error) {
        console.error('Error fetching candle data:', error)
      }
    }

    fetchCandleData()
  }, [time])

  // PRICE

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade')

    ws.onmessage = (e) => {
      const response = JSON.parse(e.data)
      const currentPrice = Number(response.p).toFixed(2)
      setPrice(currentPrice)
      if (prevPrice !== '') {
        if (currentPrice > prevPrice) setColor('green')
        else if (currentPrice < prevPrice) setColor('red')
        else setColor('white')
      }
      setPrevPrice(currentPrice)
    }

    return () => {
      ws.close()
    }
  }, [price])

  // CandlestickChart

  useEffect(() => {
    setChartWasCreated(true)

    if (chartWasCreated) {
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
      candleStick.applyOptions({
        upColor: 'rgb(12,203,129)',
        downColor: 'rgb(225, 50, 85)',
        borderVisible: false,
      })
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
        const randomTime =
          Math.floor(Math.random() * (time2 - time1 + 1)) + time1

        if (indexOfMinPriceArr[i] === 'lower') {
          markers.push({
            time: timeToLocal(datesForMarkers[i][0]) / 1000,
            position: 'aboveBar',
            color: 'red',
            shape: 'arrowDown',
            text: `Sell $${Math.floor(
              datesForMarkers[i][2] + 2
            )} ${formatTimeStampToFullDate(randomTime)} Size: 3 BTC`,
          })
        } else {
          markers.push({
            time: timeToLocal(datesForMarkers[i][0]) / 1000,
            position: 'belowBar',
            color: '#1fff1f',
            shape: 'arrowUp',
            text: `Buy $${Math.floor(
              datesForMarkers[i][3] - 2
            )} ${formatTimeStampToFullDate(randomTime)} Size: 3 BTC`,
          })
        }
      }

      candleStick.setMarkers(markers)

      // < --------------------------------------->

      const webSocketKlineCandleStick = new WebSocket(
        `wss://stream.binance.com:9443/ws/btcusdt@kline_${time}`
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
    }
  }, [data])

  return (
    <div className="binance__container">
      <div className="binance__wrapper">
        <div className="binance__wrapper_top-part">
          <p>Time:</p>
          <div className="time-period__container">
            <select
              className="time-period__container_select"
              value={time}
              onChange={handleTime}
            >
              <option value="1m">1m</option>
              <option value="3m">3m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="30m">30m</option>
              <option value="1h">1h</option>
              <option value="2h">2h</option>
              <option value="4h">4h</option>
              <option value="6h">6h</option>
              <option value="8h">8h</option>
              <option value="12h">12h</option>
              <option value="1d">1d</option>
              <option value="3d">3d</option>
              <option value="1w">1w</option>
              <option value="1M">1M</option>
            </select>
          </div>
          BTCUSDT
          <div className="price__container" style={{ color }}>
            <p className="price__container_price">{price}</p>
          </div>
        </div>
        <div className="binance__wrapper_bottom-part">
          {data && <div ref={chartContainerRef}></div>}
        </div>
      </div>
    </div>
  )
}

export default ChartPackage
