// entrypoints/components/JsonCanvas/components/CanvasNode.tsx
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { Node, colors } from '../types'

export function CanvasNode({ node }: { node: Node }) {
  return (
    <div
      id={node.id}
      className="node"
      style={{
        position: 'absolute',
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
        border: `2px solid ${colors[node.color] || '#EBEDE9'}`,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        lineHeight: '18px',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      {node.type === 'text' && (
        <div className="node-content">
          <Markdown
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkFrontmatter]}
            className="markdown"
          >
            {node.text || ''}
          </Markdown>
        </div>
      )}
    </div>
  )
}
