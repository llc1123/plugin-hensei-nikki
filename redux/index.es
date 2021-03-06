import { combineReducers } from 'redux'
import { loadData, transSavedData } from '../utils'

export function onSaveData(title, fleets) {
  return {
    type: '@@HENSEI_SAVE_DATA',
    title,
    fleets,
  }
}
export function onSaveTitle(oldTitle, newTitle) {
  return {
    type: '@@HENSEI_REPLACE_TITLE',
    oldTitle,
    newTitle,
  }
}
export function onSaveNote(title, note) {
  return {
    type: '@@HENSEI_REPLACE_NOTE',
    title,
    note,
  }
}
export function onImportData(importData) {
  return {
    type: '@@HENSEI_IMPORT_DATA',
    importData,
  }
}
export function onImportFile(fileBuffer) {
  return {
    type: '@@HENSEI_IMPORT_FILE',
    fileBuffer,
  }
}
export function onDeleteData(title) {
  return {
    type: '@@HENSEI_DELETE_DATA',
    title,
  }
}
const initialState = {
  "initStatus": {
    "init": false,
  },
  "henseiData": {
    "data": {},
  },
}

function initStatusReducer(state = initialState.initStatus, action) {
  switch (action.type) {
  case '@@Response/kcsapi/api_get_member/require_info':
  case '@@poi-plugin-hensei-nikki@init':
    return {
      ...state,
      init: true,
    }
  }
  return state
}

function dataReducer(state = initialState.henseiData, action) {
  const data = { ...state.data }
  switch (action.type) {
  case '@@Response/kcsapi/api_get_member/require_info':
  case '@@poi-plugin-hensei-nikki@init':
    return {
      ...state,
      data: loadData(),
    }
  case '@@HENSEI_SAVE_DATA': {
    const { title, fleets } = action
    data[title] = fleets
    return {
      ...state,
      data,
    }
  }
  case '@@HENSEI_REPLACE_TITLE': {
    const { oldTitle, newTitle } = action
    data[newTitle] = data[oldTitle]
    delete data[oldTitle]
    return {
      ...state,
      data,
    }
  }
  case '@@HENSEI_REPLACE_NOTE': {
    const { title, note } = action
    data[title].note = note
    return {
      ...state,
      data,
    }
  }
  case '@@HENSEI_IMPORT_FILE': {
    const { fileBuffer } = action
    let msg
    if (!(typeof fileBuffer === 'object')) {
      msg = "文件内容格式错误"
    } else {
      const formattedData = transSavedData(fileBuffer)
      for (const title in formattedData) {
        const tempData = formattedData[title]
        if (!tempData) continue
        if (Object.keys(data).includes(title)) {
          if (data[title] != tempData) {
            data[`${title}_1`] = tempData
          }
        } else {
          data[title] = tempData
        }
      }
      const sum = Object.keys(data).length - Object.keys(state.data).length
      msg = sum ? `成功导入${sum}条数据` : "无可用数据"
    }
    if (msg) window.toggleModal(msg)

    return {
      ...state,
      data,
    }
  }
  case '@@HENSEI_DELETE_DATA': {
    const { title } = action
    delete data[title]
    return {
      ...state,
      data,
    }
  }
  }
  return state
}

export const reducer = combineReducers({
  initStatus: initStatusReducer,
  henseiData: dataReducer,
})
