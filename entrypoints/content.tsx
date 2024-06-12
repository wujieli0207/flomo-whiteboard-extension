import './popup/style.css'
import ReactDOM from 'react-dom/client'
import App from './popup/App'

export default defineContentScript({
  matches: ['https://v.flomoapp.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
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
  },
})
