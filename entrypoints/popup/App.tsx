import '../style.css'
import { IMessage } from './types'

const App = () => {
  const handleOpenWhiteboard = async () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const activeTab = tabs[0]
      const tid = activeTab.id ?? -1

      if (activeTab && tid > 0) {
        const message: IMessage = {
          isOpenWhiteboard: true,
        }
        browser.runtime.sendMessage(message)
      }
    })
  }

  return (
    <div className="flex flex-col items-center h-48 p-2 w-36">
      <button onClick={handleOpenWhiteboard}>开启白板</button>
    </div>
  )
}

export default App
