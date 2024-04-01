import './styles.css'

import React, { useState, useEffect } from 'react'

const Price = () => {
  const [price, setPrice] = useState('')
  const [prevPrice, setPrevPrice] = useState('')
  const [color, setColor] = useState('')

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
  }, [prevPrice])

  return (
    <div className="price__container" style={{ color }}>
      <p className="price__container_price">{price}</p>
    </div>
  )
}

export default Price
