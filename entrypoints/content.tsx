import './popup/style.css'
import ReactDOM from 'react-dom/client'
import App from './popup/App'
import Splitter from './popup/Splitter'

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'manifest',

  async main(ctx) {
    let whiteBoardWidth = '200'

    // === 当前主页宽度 ===
    // 创建一个style标签
    const styleTag = document.createElement('style')

    // 设置CSS规则，将页面宽度设置为80%
    styleTag.innerHTML = `
      body {
        width: 800px !important;
      }
    `

    // 将style标签添加到页面的<head>中
    document.head.appendChild(styleTag)

    // === 分隔条 ===
    // 创建分隔条
    // const splitter = document.createElement('div')
    // splitter.className = 'splitter' // 添加一个类以便在CSS中定位
    // splitter.style.position = 'fixed'
    // splitter.style.top = '0'
    // splitter.style.right = '0'
    // splitter.style.height = '100%'
    // splitter.style.width = '5px' // 分隔条的宽度
    // splitter.style.backgroundColor = '#000' // 分隔条的颜色
    // splitter.style.cursor = 'col-resize' // 鼠标光标的样式

    // // 将分隔条添加到页面中
    // document.body.appendChild(splitter)

    const splitter = await createShadowRootUi(ctx, {
      name: 'flomo-whiteboard-splitter',
      position: 'inline',
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement('div')
        container.append(app)

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app)
        root.render(<Splitter />)
        return root
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount()
      },
    })

    // app.className = 'splitter' // 添加一个类以便在CSS中定位
    splitter.shadowHost.style.position = 'fixed'
    splitter.shadowHost.style.top = '0'
    splitter.shadowHost.style.right = `calc(${whiteBoardWidth}px + 2px)`
    splitter.shadowHost.style.height = '100%'
    splitter.shadowHost.style.width = '2px'
    splitter.shadowHost.style.backgroundColor = 'gray' // 分隔条的颜色
    splitter.shadowHost.style.cursor = 'col-resize' // 鼠标光标的样式
    splitter.mount()

    // === 主页面 ===
    const app = await createShadowRootUi(ctx, {
      name: 'flomo-whiteboard',
      position: 'inline',
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement('div')
        container.append(app)

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app)
        root.render(<App />)
        return root
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount()
      },
    })

    // 固定在右侧
    app.shadowHost.style.position = 'fixed'
    app.shadowHost.style.top = '0'
    app.shadowHost.style.right = '0'
    app.shadowHost.style.height = '100%'
    app.shadowHost.style.width = `${whiteBoardWidth}px`
    app.shadowHost.style.backgroundColor = '#fff'

    app.mount()
  },
})
