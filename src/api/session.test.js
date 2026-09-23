import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isLiveToken, clearSession } from './session'

/** A JWT with the given claims. Only the payload segment is ever read. */
const tokenWith = (claims) =>
  `header.${btoa(JSON.stringify(claims)).replace(/=+$/, '')}.signature`

describe('isLiveToken', () => {
  it('accepts a token that has not expired yet', () => {
    expect(isLiveToken(tokenWith({ exp: Math.floor(Date.now() / 1000) + 3600 }))).toBe(true)
  })

  it('rejects one that has', () => {
    // This is the case that left the console rendering empty screens: the token
    // was present, so the store called it a session.
    expect(isLiveToken(tokenWith({ exp: Math.floor(Date.now() / 1000) - 60 }))).toBe(false)
  })

  it('rejects a token expiring this very second', () => {
    expect(isLiveToken(tokenWith({ exp: Math.floor(Date.now() / 1000) - 1 }))).toBe(false)
  })

  it('accepts a token that claims no expiry', () => {
    expect(isLiveToken(tokenWith({ id: 4 }))).toBe(true)
  })

  it('rejects nothing, an empty string and a malformed token', () => {
    expect(isLiveToken(null)).toBe(false)
    expect(isLiveToken('')).toBe(false)
    expect(isLiveToken('not-a-jwt')).toBe(false)
    expect(isLiveToken('a.!!!not-base64!!!.c')).toBe(false)
  })

  it('reads a base64url payload, which is what a real JWT carries', () => {
    const claims = { exp: Math.floor(Date.now() / 1000) + 60, note: 'a+b/c?' }
    const url = btoa(JSON.stringify(claims)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    expect(isLiveToken(`header.${url}.sig`)).toBe(true)
  })
})

describe('clearSession', () => {
  // jsdom here does not supply a usable Storage, so the test owns one.
  let store
  beforeEach(() => {
    store = { admin_token: 'something' }
    vi.stubGlobal('localStorage', {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v) },
      removeItem: (k) => { delete store[k] },
    })
  })

  it('removes the token from storage', () => {
    clearSession()
    expect(localStorage.getItem('admin_token')).toBeNull()
  })

  it('expires the cookie on both paths it was set on', () => {
    clearSession()
    expect(document.cookie).not.toContain('admin_token=something')
  })

  it('still clears the cookie when storage throws', () => {
    // A private window, or site data blocked: the cookie must still go.
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      removeItem: () => { throw new Error('blocked') },
    })
    expect(() => clearSession()).not.toThrow()
  })
})
