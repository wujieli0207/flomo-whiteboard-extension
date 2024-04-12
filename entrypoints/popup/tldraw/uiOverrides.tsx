import {
  DefaultActionsMenu,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  TLComponents,
  TLUiOverrides,
  TldrawUiMenuItem,
  toolbarItem,
  useTools,
} from 'tldraw'

// There's a guide at the bottom of this file!

export const uiOverrides: TLUiOverrides = {
  // 自定义 toolbar 按钮
  tools(editor, tools) {
    return tools
  },
  toolbar(_app, toolbar, { tools }) {
    // toolbar 仅展示必要的内容
    const result = toolbar.filter((item) =>
      // 选择，拖动页面，连线，便签，图片
      ['select', 'hand', 'arrow', 'note', 'asset'].includes(item.id)
    )
    return result
  },
}

export const components: TLComponents = {
  ActionsMenu: () => {
    return <DefaultActionsMenu />
  },
  Toolbar: () => {
    return <DefaultToolbar />
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools()
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        {/* Ideally, we'd interleave this into the tools group */}
        <TldrawUiMenuItem {...tools['MemoShape']} />
      </DefaultKeyboardShortcutsDialog>
    )
  },
}
