import { describe, it, expect } from 'vitest'
import en from './locales/en.json'
import hi from './locales/hi.json'

type LocaleTree = Record<string, unknown>

function flatten(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  const tree = obj as LocaleTree
  return Object.keys(tree).flatMap(key => flatten(tree[key], prefix ? `${prefix}.${key}` : key))
}

describe('i18n locales', () => {
  it('all locale files share the exact same key structure', () => {
    const enKeys = flatten(en).sort()
    const hiKeys = flatten(hi).sort()
    expect(hiKeys).toEqual(enKeys)
  })

  it('has no empty translation values', () => {
    const check = (obj: unknown, prefix = ''): string[] => {
      const tree = obj as LocaleTree
      return Object.keys(tree).flatMap(key => {
        const value = tree[key]
        const path = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'object' && value !== null) return check(value, path)
        return typeof value === 'string' && value.trim().length === 0 ? [path] : []
      })
    }
    expect(check(en)).toEqual([])
    expect(check(hi)).toEqual([])
  })
})
