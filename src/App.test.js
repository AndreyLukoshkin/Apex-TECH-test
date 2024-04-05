import { render, screen } from '@testing-library/react'
import Binance from './components/Binance/Binance'

test('renders learn react link', () => {
  render(<Binance />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
