import { Tldraw } from 'tldraw'
import './style.css'
import { FC } from 'react'

interface IProps {
  width: string
}

const App: FC<IProps> = ({ width }) => {
  return (
    <div
      className="h-full"
      style={{ position: 'fixed', top: 0, right: 0, width: `${width}px` }}
    >
      <Tldraw />
    </div>
  )
}

export default App
