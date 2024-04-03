import ReactDOM from 'react-dom'
import React from 'react'

import reportWebVitals from './reportWebVitals'

import App from './App'
import TimePeriod from './components/TimePeriod/TimePeriod'
import Price from './components/Price/Price'
import CandlestickChart from './components/CandlestickChart/CandlestickChart'
import Binance from './components/Binance/Binance'

import { formatTimeStampToFullDate, timeToLocal } from './helpers/helper'

export {
  App,
  formatTimeStampToFullDate,
  timeToLocal,
  TimePeriod,
  Price,
  CandlestickChart,
  Binance,
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

reportWebVitals()
