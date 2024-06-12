import { browser } from 'wxt/browser'

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id })

  // browser.storage.onChanged.addListener(function (changes, namespace) {
  //   console.log('changes: ', changes)
  //   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
  //     console.log('oldValue: ', oldValue)
  //     console.log('newValue: ', newValue)
  //     if (key === 'isOpenBoard') {
  //       // // 发送消息到 content script
  //       // chrome.tabs.query({}, function (tabs) {
  //       //   for (let tab of tabs) {
  //       //     chrome.tabs.sendMessage(tab.id, { isOpenBoard: newValue })
  //       //   }
  //       // })
  //     }
  //   }
  // })
})
