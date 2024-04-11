import { BaseBoxShapeTool } from 'tldraw'
export class MyshapeTool extends BaseBoxShapeTool {
  static override id = 'MemoShape'
  static override initial = 'idle'
  override shapeType = 'MemoShape'
}
