import { ElMessage } from 'element-plus'

const showMessage = (msg: string, callback?: () => void, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  ElMessage({
    type,
    message: msg,
    duration: 2000,
    offset: 200,
    onClose: () => callback && callback()
  })
}

const message = {
  error: (msg: string, callback?: () => void) => showMessage(msg, callback, 'error'),
  success: (msg: string, callback?: () => void) => showMessage(msg, callback, 'success'),
  warning: (msg: string, callback?: () => void) => showMessage(msg, callback, 'warning'),
  info: (msg: string, callback?: () => void) => showMessage(msg, callback, 'info')
}

export default message
