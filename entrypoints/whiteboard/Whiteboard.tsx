// entrypoints/whiteboard/Whiteboard.tsx
import { useEffect, useState, useRef } from 'react'
import { Card } from 'antd'
import { Tldraw, Editor } from 'tldraw'
// @ts-ignore
import Sortable from 'sortablejs'
import { IMemo } from './types'
import '../style.css'
import { MyShapeUtil } from './tldraw/shapeUtil'

const Whiteboard = () => {
  const customShape = [MyShapeUtil]

  const memoRefs = useRef<HTMLDivElement | null>(null)

  const [boardEditor, setBoardEditor] = useState<Editor | null>(null)
  const [memos, setMemos] = useState<IMemo[]>([])

  useEffect(() => {
    // 监听浏览器扩展的消息
    browser.runtime.onMessage.addListener((message) => {
      if (message.memosData) {
        setMemos(message.memosData as IMemo[])
      }
    })
  }, [])

  // 绑定 Sortable 拖动事件到每个 memo
  useEffect(() => {
    if (boardEditor && memoRefs.current?.childNodes) {
      memoRefs.current.childNodes.forEach((el, index) => {
        if (el) {
          // 创建 Sortable 实例
          Sortable.create(el, {
            ghostClass: 'sortable-ghost',
            onEnd: (event: any) => {
              console.log('event: ', event)
              const htmlStr = event.item.innerHTML as string
              console.log('htmlStr: ', htmlStr)
              boardEditor.createShape({
                type: 'memo',
                props: {
                  contentHTML: htmlStr,
                },
              })
            },
          })
        }
      })
    }
  }, [boardEditor, memos])

  return (
    <div className="flex w-full h-screen p-4 ">
      <div ref={memoRefs} className="memo w-[20%] h-full overflow-auto">
        {memos.map((memo) => (
          <Card
            key={memo.id}
            style={{ marginBottom: '16px' }}
            data-memo={JSON.stringify(memo)} // 将 Memo 数据存储在 DOM 属性中
          >
            <div dangerouslySetInnerHTML={{ __html: memo.content }} />
          </Card>
        ))}
      </div>

      <div className="p-4 mt-4 w-[80%]">
        <Tldraw
          shapeUtils={customShape}
          onMount={(editor) => {
            setBoardEditor(editor)
          }}
        />
      </div>
    </div>
  )
}

export default Whiteboard
