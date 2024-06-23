import {
  Geometry2d,
  HTMLContainer,
  RecordProps,
  Rectangle2d,
  ShapeUtil,
  T,
  TLBaseShape,
  TLOnResizeHandler,
  Tldraw,
  resizeBox,
} from 'tldraw'
import 'tldraw/tldraw.css'

// There's a guide at the bottom of this file!

// [1]
type ICustomShape = TLBaseShape<
  'memo',
  {
    w: number
    h: number
    contentHTML: string
  }
>

// [2]
export class MyShapeUtil extends ShapeUtil<ICustomShape> {
  // [a]
  static override type = 'memo' as const
  static override props: RecordProps<ICustomShape> = {
    w: T.number,
    h: T.number,
    contentHTML: T.string,
  }

  // [b]
  getDefaultProps(): ICustomShape['props'] {
    return {
      w: 200,
      h: 200,
      contentHTML: '',
    }
  }

  // [c]
  override canEdit = () => false
  override canResize = () => true
  override isAspectRatioLocked = () => false

  // [d]
  getGeometry(shape: ICustomShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  // [e]
  override onResize: TLOnResizeHandler<any> = (shape, info) => {
    return resizeBox(shape, info)
  }

  // [f]
  component(shape: ICustomShape) {
    return (
      <HTMLContainer style={{ backgroundColor: '#efefef' }}>
        <div dangerouslySetInnerHTML={{ __html: shape.props.contentHTML }} />
      </HTMLContainer>
    )
  }

  // [g]
  indicator(shape: ICustomShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
