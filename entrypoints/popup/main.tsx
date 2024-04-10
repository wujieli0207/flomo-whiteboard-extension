import './style.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme } from '@radix-ui/themes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme>
      {/* 这里的 width 暂时不需要使用，添加是为了防止 ts 报错 */}
      <App width="300" />
    </Theme>
  </React.StrictMode>
)
