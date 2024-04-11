import './popup/style.css'
import ReactDOM from 'react-dom/client'
import Sortable from 'sortablejs'
import App from './popup/App'
import Splitter from './popup/Splitter'

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let whiteBoardWidth = '800'

    // === 当前主页宽度 ===
    // 创建一个style标签
    const styleTag = document.createElement('style')

    // 设置CSS规则，将页面宽度设置为80%
    styleTag.innerHTML = `
      body {
        width: calc(100% - ${whiteBoardWidth}px - 2px) !important;
      }
    `

    // 将style标签添加到页面的<head>中
    document.head.appendChild(styleTag)

    // === 分隔条 ===

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

    // 分隔条监听事件
    splitter.shadowHost.addEventListener('mousedown', (event) => {
      console.log('event: ', event)
    })

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
        root.render(<App width={whiteBoardWidth} />)
        return root
      },
      onRemove: (root) => {
        root?.unmount()
      },
    })

    // // 固定在右侧
    // app.shadowHost.style.position = 'fixed'
    // app.shadowHost.style.top = '0'
    // app.shadowHost.style.right = '0'
    // app.shadowHost.style.height = '100%'
    // app.shadowHost.style.width = `${whiteBoardWidth}px`
    // app.shadowHost.style.backgroundColor = '#fff'

    app.mount()

    setTimeout(() => {
      // === flomo 卡片拖动效果 ===
      const memos = document.getElementsByClassName('memos')[0]
      console.log('memos: ', memos)

      if (memos) {
        // 所有卡片
        const memoEls = document.getElementsByClassName('memo')
        console.log('memoEls: ', memoEls)

        for (let i = 0; i < memoEls.length; i++) {
          const memoEl = memoEls[i]

          // 拖动事件
          Sortable.create(memoEl, {
            ghostClass: 'sortable-ghost',
            onEnd: (event) => {
              console.log('event: ', event)
              console.log('eventhmlt: ', event.from.style.width)
              const htmlStr = event.from.innerHTML
              console.log('htmlStr: ', htmlStr)
              // @ts-ignore
              window.tldrawEditor.createShape({
                id: 'shape:' + Date.now(),
                type: 'MemoShape',
                props: {
                  contentHTML: htmlStr,
                },
              })
            },
          })
        }
      }
    }, 2000)
  },
})
