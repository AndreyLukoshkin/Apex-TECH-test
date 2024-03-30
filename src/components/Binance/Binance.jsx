import React, { useEffect } from 'react'

import './styles.css'
import Graphic from '../Graphic/Graphic'
import TimePeriod from '../TimePeriod/TimePeriod'
import Price from '../Price/Price'

const Binance = () => {
  return (
    <div className="binance__container">
      <div className="binance__wrapper">
        <div className="binance__wrapper_top">
          <TimePeriod />
          <Price />
        </div>
        <Graphic />
      </div>
    </div>
  )
}

export default Binance
