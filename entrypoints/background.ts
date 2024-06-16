import { IMessage } from './popup/types'
import { IMemo } from './whiteboard/types'

// entrypoints/background.ts
function openNewTab(url: string, data: IMemo[]) {
  browser.tabs.create({ url }).then((tab) => {
    // 在新打开的标签页上注入数据
    const tabId = tab.id
    if (tabId) {
      // 等待新标签页加载完成
      browser.tabs.onUpdated.addListener(function listener(tabIdUpdated, info) {
        if (tabId === tabIdUpdated && info.status === 'complete') {
          // 发送 memos 数据到新标签页的内容脚本
          browser.tabs.sendMessage(tabId, { memosData: data })
          // 移除监听器
          browser.tabs.onUpdated.removeListener(listener)
        }
      })
    }
  })
}

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id })

  // 接收来自内容脚本的消息
  browser.runtime.onMessage.addListener(function (request) {
    // 打开新的 whiteboard 标签页并传递数据
    if (request.memosData) {
      openNewTab(
        browser.runtime.getURL('/whiteboard.html'),
        request.memosData as IMemo[]
      )
    }

    // 转发来自 popup 的消息
    if (request.message) {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const activeTab = tabs[0]
        const tid = activeTab?.id ?? -1

        if (activeTab && tid > 0) {
          browser.tabs.sendMessage(tid, request.message as IMessage)
        }
      })
    }
  })
})
