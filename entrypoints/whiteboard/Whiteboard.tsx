// entrypoints/whiteboard/Whiteboard.tsx
import { useEffect, useState, useRef } from 'react'
import { Card } from 'antd'
// @ts-ignore
import Sortable from 'sortablejs'
import { Canvas } from '../components/JsonCanvas'
import { IMemo } from './types'
import '../style.css'

const Whiteboard = () => {
  const [memos, setMemos] = useState<IMemo[]>([])
  const [canvasNodes, setCanvasNodes] = useState<any[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 监听浏览器扩展的消息
    browser.runtime.onMessage.addListener((message) => {
      if (message.memosData) {
        setMemos(message.memosData as IMemo[])
      }
    })
  }, [])

  useEffect(() => {
    if (drawerRef.current && canvasRef.current) {
      // 配置 Drawer 的 SortableJS
      Sortable.create(drawerRef.current, {
        group: 'shared', // 允许跨容器拖放
        draggable: '.ant-card', // 只允许拖动 Card
        animation: 150,
        onEnd: (event) => {
          // 禁止从 Drawer 中移除被拖动的 memo
          // 允许卡片在左侧和右侧保持同步
          if (event.to !== drawerRef.current) {
            event.from.insertBefore(
              event.item,
              event.from.children[event.oldIndex]
            )
          }
        },
      })

      // 配置 Canvas 的 SortableJS
      Sortable.create(canvasRef.current, {
        group: 'shared', // 允许接收来自 Drawer 的拖动
        animation: 150,
        onAdd: (event) => {
          const memoData = event.item.getAttribute('data-memo')
          if (memoData) {
            const memo = JSON.parse(memoData) as IMemo
            const rect = canvasRef.current?.getBoundingClientRect()
            const x = event.clientX - (rect?.left || 0)
            const y = event.clientY - (rect?.top || 0)

            // 添加 memo 到 canvasNodes
            setCanvasNodes((prevNodes) => [
              ...prevNodes,
              {
                id: `memo-${memo.id}`,
                type: 'text',
                label: '', // 移除标题
                file: '',
                x: x / 1,
                y: y / 1,
                width: 200,
                height: 100,
                color: '1',
                text: memo.content,
              },
            ])
          }
        },
      })
    }
  }, [drawerRef, canvasRef])

  const canvasContent = {
    edges: [], // 初始没有边
    initialNodes: canvasNodes,
  }

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

      <div
        className="p-4 mt-4 w-[70%]"
        ref={canvasRef}
        onDrop={(event) => event.preventDefault()} // 防止默认行为
        onDragOver={(event) => event.preventDefault()} // 防止默认行为
        style={{ position: 'relative', height: '600px' }} // 给 canvas 定义一个高度
      >
        {JSON.stringify(canvasNodes)}
        <Canvas content={canvasContent} />
      </div>
    </div>
  )
}

export default Whiteboard
