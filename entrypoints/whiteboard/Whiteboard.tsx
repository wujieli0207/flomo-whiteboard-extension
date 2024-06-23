// entrypoints/whiteboard/Whiteboard.tsx
import { useEffect, useState, useRef } from 'react'
import { Card } from 'antd'
import { IMemo } from './types'
import '../style.css'

const Whiteboard = () => {
  const [memos, setMemos] = useState<IMemo[]>([])
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 监听浏览器扩展的消息
    browser.runtime.onMessage.addListener((message) => {
      if (message.memosData) {
        setMemos(message.memosData as IMemo[])
      }
    })
  }, [])

  return (
    <div className="flex w-full h-full p-4">
      <div className="w-[30%]" ref={drawerRef}>
        {memos.map((memo) => (
          <Card
            key={memo.id}
            className="draggable-memo"
            style={{ marginBottom: '16px' }}
            data-memo={JSON.stringify(memo)} // 将 Memo 数据存储在 DOM 属性中
          >
            <div dangerouslySetInnerHTML={{ __html: memo.content }} />
          </Card>
        ))}
      </div>

      <div className="p-4 mt-4 w-[70%]">wip</div>
    </div>
  )
}

export default Whiteboard
