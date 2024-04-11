import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  TLComponents,
  TLUiOverrides,
  TldrawUiMenuItem,
  toolbarItem,
  useTools,
} from 'tldraw'

// There's a guide at the bottom of this file!

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Create a tool item in the ui's context.
    tools.MemoShape = {
      id: 'MemoShape',
      icon: 'color',
      label: 'MemoShape',
      kbd: 'c',
      onSelect: () => {
        editor.setCurrentTool('MemoShape')
      },
    }
    return tools
  },
  toolbar(_app, toolbar, { tools }) {
    // Add the tool item from the context to the toolbar.
    toolbar.splice(4, 0, toolbarItem(tools.MemoShape))
    return toolbar
  },
}

export const components: TLComponents = {
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
