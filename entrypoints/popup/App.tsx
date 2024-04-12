import { Tldraw } from 'tldraw'
import './style.css'
import { FC } from 'react'

import { MyshapeTool } from './tldraw/shapeTool'
import { MyshapeUtil } from './tldraw/shapeUtil'
import { components, uiOverrides } from './tldraw/uiOverrides'

// [1]
const customShapeUtils = [MyshapeUtil]
const customTools = [MyshapeTool]

const App = () => {
  return (
    <div
      id="whiteboard"
      className="h-full"
      style={{ position: 'fixed', top: 0, right: 0 }}
    >
      <Tldraw
        persistenceKey="flomo-whiteboard"
        onMount={(editor) => {
          // @ts-ignore
          window.tldrawEditor = editor
        }}
        // Pass in the array of custom shape classes
        shapeUtils={customShapeUtils}
        // Pass in the array of custom tools
        tools={customTools}
        // Pass in any overrides to the user interface 底部操作按钮，暂时不用
        // overrides={uiOverrides}
        // pass in the new Keyboard Shortcuts component 快捷键，暂时也不用
        // components={components}
      />
    </div>
  )
}

export default App
