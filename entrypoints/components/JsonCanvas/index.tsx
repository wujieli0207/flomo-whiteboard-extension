// entrypoints/components/JsonCanvas/index.tsx
import { useEffect, useRef, useState } from 'react'
import { CanvasNode } from './components/CanvasNode'
import { Edges } from './components/Edges'
import './index.css'
import { CanvasContent, Node } from './types'
// @ts-ignore
import Sortable from 'sortablejs'

export interface CanvasProps {
  content: CanvasContent
}

export function Canvas({ content }: CanvasProps) {
  const [nodes, setNodes] = useState(content.initialNodes)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNodes(content.initialNodes)

    setTimeout(() => {
      if (canvasRef.current) {
        // 初始化 SortableJS
        Sortable.create(canvasRef.current, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          onStart: (event: any) => {
            console.log('Drag start', event)
            console.log('content.initialNodes: ', content.initialNodes)
            // 确保在拖动开始时，节点的初始位置被正确记录
            const node = content.initialNodes.find(
              (n) => n.id === event.item.id
            )
            if (node) {
              node.startX = node.x
              node.startY = node.y
            }
          },
          onMove: (event: any) => {
            console.log('Drag move', event)
            // 在拖动过程中实时更新位置
            const node = nodes.find((n) => n.id === event.dragged.id)
            if (node) {
              const canvasRect = canvasRef.current?.getBoundingClientRect()
              const draggedRect = event.dragged.getBoundingClientRect()

              if (canvasRect) {
                // 计算相对于 Canvas 的新位置
                const newX = draggedRect.left - canvasRect.left
                const newY = draggedRect.top - canvasRect.top

                node.x = newX
                node.y = newY

                // 更新 nodes 数组
                setNodes([...nodes])
              }
            }
          },
          onEnd: (event: any) => {
            console.log('Drag end', event)
            // 确保在拖动结束时，节点的新位置被保存
            const nodeId = event.item.id
            const newX = event.item.offsetLeft
            const newY = event.item.offsetTop

            updateNodePosition(nodeId, newX, newY)
          },
        })
      }
    }, 1 * 1000)
  }, [content.initialNodes, canvasRef])

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              x,
              y,
            }
          : node
      )
    )
  }

  return (
    <div
      ref={containerRef}
      className="json-canvas"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        ref={canvasRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {nodes.map((node) => (
          <CanvasNode key={node.id} node={node} />
        ))}
      </div>
      <Edges
        scale={1} // 固定比例为 1
        content={content}
        translateX={0} // 固定值为 0
        translateY={0} // 固定值为 0
      />
    </div>
  )
}
