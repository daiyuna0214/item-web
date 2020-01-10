// 本地存储模块

// 获取存储
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (error) {
    console.log('转换失败', error)
    return data// 转换失败返回原始数据
  }
}

// 设置存储
export const setItem = (name, value) => {
  const data = typeof value === 'object'
    ? JSON.stringify(value)
    : value
  window.localStorage.setItem(name, data)
}

// 删除存储
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
