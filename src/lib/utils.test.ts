import { describe, it, expect } from 'vitest'
import { cn, formatINR, formatDate } from './utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('drops falsy values', () => {
    expect(cn('px-2', undefined, null, false, '')).toBe('px-2')
  })

  it('merges conflicting tailwind classes, keeping the last', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('formatINR', () => {
  it('formats amounts in Indian Rupees with no decimals', () => {
    const out = formatINR(1500)
    expect(out).toMatch(/1,500/)
    expect(out).toContain('₹')
  })

  it('handles zero', () => {
    const out = formatINR(0)
    expect(out).toContain('0')
  })

  it('uses Indian digit grouping for lakhs', () => {
    const out = formatINR(150000)
    expect(out).toMatch(/1,50,000/)
  })
})

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('')
  })

  it('formats to DD/MM/YYYY', () => {
    expect(formatDate('2025-03-07')).toBe('07/03/2025')
  })

  it('pads single digit days and months', () => {
    expect(formatDate('2025-01-01')).toBe('01/01/2025')
  })
})
