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
    const initScreenLeft = (await storage.getItem('local:screenLeft')) ?? '50'
    const initScreenRight = (await storage.getItem('local:screenRight')) ?? '50'

    let flomoAppWidth = `calc(${initScreenLeft}% - 10px)`
    let whiteBoardWidth = `calc(${initScreenRight}% - 10px)`

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

    // 控制 flomo 侧边栏折叠和展开
    handleFlomoSidebar(Number(initScreenLeft))

    Split(['#app', app.shadowHost], {
      sizes: [Number(initScreenLeft), Number(initScreenRight)],
      onDragEnd: async (size) => {
        const [screenLeft, screenRight] = size

        // 控制 flomo 侧边栏折叠和展开
        handleFlomoSidebar(screenLeft)

        flomoAppWidth = `calc(${screenLeft}% - 10px)`
        whiteBoardWidth = `calc(${screenRight}% - 10px)`

        // 持久化比例
        await storage.setItem('local:screenLeft', screenLeft)
        await storage.setItem('local:screenRight', screenRight)

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

              // 获取鼠标释放时的屏幕坐标
              const mouseX = event.originalEvent.clientX
              const mouseY = event.originalEvent.clientY

              // @ts-ignore
              const canvasContainer = app.shadow.querySelector('.tl-container')
              const containerRect = canvasContainer!.getBoundingClientRect()

              // 转换屏幕坐标到画布坐标
              const x = mouseX - containerRect.left
              const y = mouseY - containerRect.top
              console.log('x，y: ', x, y)

              // @ts-ignore
              window.tldrawEditor.createShape({
                id: 'shape:' + Date.now(),
                type: 'MemoShape',
                x,
                y,
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

/**
 * @description 控制 flomo 侧边栏折叠和展开
 */
function handleFlomoSidebar(screenLeft: number) {
  // 控制 flomo 侧边栏折叠和展开
  const flomoSidebar = document.querySelector('.el-aside.left.aside-container')
  if (screenLeft < 40) {
    flomoSidebar?.classList.remove('show')
    flomoSidebar?.classList.add('hide')
  } else {
    flomoSidebar?.classList.remove('hide')
    flomoSidebar?.classList.add('show')
  }
}
