import toast from 'react-hot-toast'

export const notify = (txt: string, type: 'success' | 'error' | 'loading'= 'success') => {
  toast[type](txt, { position: 'top-center' })
}
