import React, { useEffect, useState } from 'react'

import './styles.css'

import TimePeriod from '../TimePeriod/TimePeriod'
import Price from '../Price/Price'
import CandlestickChart from '../CandlestickChart/CandlestickChart'
import axios from 'axios'

const Binance = () => {
  const [time, setTime] = useState('1h')
  const [data, setData] = useState()
  // const [dataLive, setDataLive] = useState()

  useEffect(() => {
    // const webkline = new WebSocket(
    //   'wss://stream.binance.com:9443/ws/btcusdt@kline_1h'
    // )

    // webkline.onmessage = (ev) => {
    //   const res = JSON.parse(ev.data)
    //   setDataLive(res)
    // }

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
          <div>Time</div>
          <TimePeriod time={time} setTime={setTime} />
          <Price />
        </div>
        <div className="binance__wrapper_bottom-part">
          {data && <CandlestickChart data={data.data} />}
        </div>
      </div>
    </div>
  )
}

export default Binance
