/**
 * Safe access to browser storage.
 *
 * localStorage throws in private-mode Safari, when the quota is full, and in
 * some embedded webviews - a portfolio should not break because of that. Every
 * call here is wrapped, and the functions report failure instead of throwing.
 */

const PREFIX = 'smh-portfolio:v1'

function fullKey(key) {
  return `${PREFIX}:${key}`
}

function available(store) {
  try {
    const probe = '__probe__'
    store.setItem(probe, '1')
    store.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export const storageAvailable = {
  local: typeof window !== 'undefined' && Boolean(window.localStorage) && available(window.localStorage),
  session:
    typeof window !== 'undefined' && Boolean(window.sessionStorage) && available(window.sessionStorage),
}

function readFrom(store, key, fallback) {
  if (!store) return fallback
  try {
    const raw = store.getItem(fullKey(key))
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeTo(store, key, value) {
  if (!store) return false
  try {
    store.setItem(fullKey(key), JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function removeFrom(store, key) {
  if (!store) return false
  try {
    store.removeItem(fullKey(key))
    return true
  } catch {
    return false
  }
}

const local = typeof window !== 'undefined' ? window.localStorage : null
const session = typeof window !== 'undefined' ? window.sessionStorage : null

export const storage = {
  get: (key, fallback = null) => readFrom(local, key, fallback),
  set: (key, value) => writeTo(local, key, value),
  remove: (key) => removeFrom(local, key),

  getSession: (key, fallback = null) => readFrom(session, key, fallback),
  setSession: (key, value) => writeTo(session, key, value),
  removeSession: (key) => removeFrom(session, key),

  isPersistent: () => storageAvailable.local,
}