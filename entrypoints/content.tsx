import './popup/style.css'
import ReactDOM from 'react-dom/client'
// @ts-ignore
import Sortable from 'sortablejs'
import Split from 'split.js'
import App from './popup/App'

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let flomoAppWidth = 'calc(50% - 10px)'
    let whiteBoardWidth = 'calc(50% - 10px)'

    const styleTag = document.createElement('style')
    // 设置分隔条样式
    styleTag.innerHTML = `
      .gutter {
        background-color: #eee;
        background-repeat: no-repeat;
        background-position: 50%;
        z-index: 99999;
      } 

      .gutter.gutter-horizontal {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
        cursor: col-resize;
      }
    `

    document.head.appendChild(styleTag)

    document.body.style.display = 'flex'

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
        root?.unmount()
      },
    })

    app.mount()

    Split(['#app', app.shadowHost], {
      onDragEnd: (size) => {
        const [screenLeft, screenRight] = size

        // 控制 flomo 侧边栏折叠和展开
        const flomoSidebar = document.querySelector(
          '.el-aside.left.aside-container'
        )
        if (screenLeft < 40) {
          flomoSidebar?.classList.remove('show')
          flomoSidebar?.classList.add('hide')
        } else {
          flomoSidebar?.classList.remove('hide')
          flomoSidebar?.classList.add('show')
        }

        flomoAppWidth = `calc(${screenLeft}% - 10px)`
        whiteBoardWidth = `calc(${screenRight}% - 10px)`
        if (app.shadow.getElementById('whiteboard')) {
          // @ts-ignore
          app.shadow.getElementById('whiteboard').style.width = whiteBoardWidth
        }
      },
    })

    setTimeout(() => {
      // === 获取 flomo 样式加载到 shadowDOM 中 ===
      const styleLinkList = Array.from(document.styleSheets)
        .map((sheet) => sheet.href)
        .filter(Boolean)

      if (app.shadow.querySelector('head')) {
        styleLinkList.forEach((link) => {
          if (link) {
            const linkElement = document.createElement('link')
            linkElement.rel = 'stylesheet'
            linkElement.href = link
            // @ts-ignore
            app.shadow.querySelector('head').appendChild(linkElement)
          }
        })
      }

      // === 设置白板宽度 ===
      if (app.shadow.getElementById('whiteboard')) {
        // @ts-ignore
        app.shadow.getElementById('whiteboard').style.width = whiteBoardWidth
      }

      // === flomo 卡片拖动效果 ===
      const memos = document.getElementsByClassName('memos')[0]

      if (memos) {
        // 所有卡片
        const memoEls = document.getElementsByClassName('memo')

        for (let i = 0; i < memoEls.length; i++) {
          const memoEl = memoEls[i]

          // 拖动事件
          Sortable.create(memoEl, {
            ghostClass: 'sortable-ghost',
            onEnd: (event: any) => {
              const htmlStr = event.from.innerHTML
              // @ts-ignore
              window.tldrawEditor.createShape({
                id: 'shape:' + Date.now(),
                type: 'MemoShape',
                props: {
                  w: event.from.clientWidth,
                  h: event.from.clientHeight,
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
