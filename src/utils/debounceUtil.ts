// debounceUtil.ts
export const useDebounce = (callback: any, delay: number) => {
  let timeout: NodeJS.Timeout

  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
