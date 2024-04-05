import ReactDOM from 'react-dom'
import React from 'react'

import reportWebVitals from './reportWebVitals'

import Binance from '../src/components/Binance/Binance.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Binance />
  </React.StrictMode>
)

reportWebVitals()
