import '../style.css'
import 'tldraw/tldraw.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import Whiteboard from './Whiteboard.tsx'

ReactDOM.createRoot(document.getElementById('flomo-whiteboard-root')!).render(
  <React.StrictMode>
    <Whiteboard />
  </React.StrictMode>
)
