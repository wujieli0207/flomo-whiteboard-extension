import './App.css'
import { browser } from 'wxt/browser'
import { Button, Form } from 'antd'
import { IMessage } from './types'

export default function App() {
  const handleExport = async () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const activeTab = tabs[0]
      const tid = activeTab.id ?? -1

      if (activeTab && tid > 0) {
        const message: IMessage = {
          isOpenWhiteboard: true,
        }
        browser.runtime.sendMessage({ message })
      }
    })
  }

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        labelAlign="left"
      >
        <Form.Item>
          <>
            <Button type="primary" className="button" onClick={handleExport}>
              打开 Flomo 白板
            </Button>
          </>
        </Form.Item>
      </Form>
    </>
  )
}
