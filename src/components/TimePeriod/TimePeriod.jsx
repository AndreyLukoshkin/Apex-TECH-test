import './styles.css'

import axios from 'axios'

import React, { useEffect, useState } from 'react'

const TimePeriod = () => {
  const [time, setTime] = useState('1h')

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${time}`
        )
        console.log(response)
      } catch (error) {
        console.error('Error fetching candle data:', error)
      }
    }

    fetchCandleData()
  }, [time])

  const handleTimeChange = (event) => {
    setTime(event.target.value)
  }

  return (
    <div className="selecttime">
      <select value={time} onChange={handleTimeChange}>
        <option value="1s">1s</option>
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
  )
}

export default TimePeriod
