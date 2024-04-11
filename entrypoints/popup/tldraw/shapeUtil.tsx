import { useState } from 'react'
import {
  HTMLContainer,
  Rectangle2d,
  ShapeProps,
  ShapeUtil,
  T,
  TLBaseShape,
  TLOnEditEndHandler,
  TLOnResizeHandler,
  resizeBox,
  structuredClone,
  useIsEditing,
} from 'tldraw'

// There's a guide at the bottom of this file!

// [1]
type IMemoCard = TLBaseShape<
  'MemoShape',
  {
    w: number
    h: number
    contentHTML: string
  }
>

export class MyshapeUtil extends ShapeUtil<IMemoCard> {
  // [2]
  static override type = 'MemoShape' as const
  static override props: ShapeProps<IMemoCard> = {
    w: T.number,
    h: T.number,
    contentHTML: T.string,
  }

  // [3]
  override isAspectRatioLocked = (_shape: IMemoCard) => true
  override canResize = (_shape: IMemoCard) => true
  override canBind = (_shape: IMemoCard) => true

  // [4]
  override canEdit = () => true

  // [5]
  getDefaultProps(): IMemoCard['props'] {
    return {
      w: 500,
      h: 500,
      contentHTML: '',
    }
  }

  // [6]
  getGeometry(shape: IMemoCard) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  // [7]
  component(shape: IMemoCard) {
    // [a]
    const isEditing = useIsEditing(shape.id)
    const [animal, setAnimal] = useState<boolean>(true)

    // [b]
    return (
      <HTMLContainer id={shape.id}>
        <div
          style={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow:
              '0px 1px 2px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            // borderRadius: '50%',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'all',
            backgroundColor: animal
              ? 'hsl(180, 34%, 86%)'
              : 'hsl(10, 34%, 86%)',
            // position: 'relative',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: shape.props.contentHTML }} />
        </div>
      </HTMLContainer>
    )
  }

  // [8] the blue box that appears around the shape when it's selected
  indicator(shape: IMemoCard) {
    const isEditing = useIsEditing(shape.id)
    return (
      <rect
        stroke={isEditing ? 'red' : 'blue'}
        width={shape.props.w}
        height={shape.props.h}
      />
    )
  }

  // [9]
  override onResize: TLOnResizeHandler<IMemoCard> = (shape, info) => {
    return resizeBox(shape, info)
  }

  // [10]
  override onEditEnd: TLOnEditEndHandler<IMemoCard> = (shape) => {
    const frame1 = structuredClone(shape)
    const frame2 = structuredClone(shape)

    frame1.x = shape.x + 1.2
    frame2.x = shape.x - 1.2

    this.editor.animateShape(frame1, { duration: 50 })

    setTimeout(() => {
      this.editor.animateShape(frame2, { duration: 50 })
    }, 100)

    setTimeout(() => {
      this.editor.animateShape(shape, { duration: 100 })
    }, 200)
  }
}
