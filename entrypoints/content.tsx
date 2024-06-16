import { IMemo } from './whiteboard/types'

// 获取 IndexedDB 数据的辅助函数
async function getIndexedDBData(): Promise<IMemo[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('flomo', 22)
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction(['memos'], 'readonly')
      const objectStore = transaction.objectStore('memos')
      const data: any[] = []

      objectStore.openCursor().onsuccess = function (event) {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          data.push(cursor.value)
          cursor.continue()
        } else {
          resolve(data)
        }
      }

      transaction.onerror = function (event) {
        reject(event)
      }
    }

    request.onerror = function (event) {
      reject(event)
    }
  })
}

export default defineContentScript({
  matches: ['https://v.flomoapp.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    browser.runtime.onMessage.addListener(async function (message) {
      if (message.isOpenWhiteboard) {
        console.log('defineContentScript message: ', message)
        // 获取 IndexedDB 中的 memos 数据
        const memosData = await getIndexedDBData()
        const filterdMemosData = memosData.filter((memo) => !memo.deleted_at)

        // 发送数据到背景脚本
        browser.runtime.sendMessage({ memosData: filterdMemosData })
      }
    })
  },
})
