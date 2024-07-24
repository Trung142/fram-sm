export function getLocalstorage(key: string) {
    const store = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem(key) || 'null') : null
    return store
}

export function setLocalstorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}