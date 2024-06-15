import '../style.css'

import { Canvas } from '../components/JsonCanvas'
import mockCanvasContent from './mock-content.json'
import { CanvasContent } from '../components/JsonCanvas/types'

const App = () => {
  return (
    <div className="w-full h-full">
      <Canvas content={mockCanvasContent as CanvasContent} />
    </div>
  )
}

export default App
