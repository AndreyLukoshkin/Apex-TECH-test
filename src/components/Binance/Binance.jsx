import React, { useEffect, useState } from 'react'

import './styles.css'

import TimePeriod from '../TimePeriod/TimePeriod'
import Price from '../Price/Price'
import CandlestickChart from '../CandlestickChart/CandlestickChart'
import axios from 'axios'

const Binance = () => {
  const [time, setTime] = useState('1m')
  const [data, setData] = useState()

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${time}`
        )
        setData(response)
      } catch (error) {
        console.error('Error fetching candle data:', error)
      }
    }

    fetchCandleData()
  }, [time])

  return (
    <div className="binance__container">
      <div className="binance__wrapper">
        <div className="binance__wrapper_top-part">
          <p>Time:</p>
          <TimePeriod time={time} setTime={setTime} />
          BTCUSDT
          <Price />
        </div>
        <div className="binance__wrapper_bottom-part">
          {data && <CandlestickChart timeLabel={time} data={data.data} />}
        </div>
      </div>
    </div>
  )
}

export default Binance
