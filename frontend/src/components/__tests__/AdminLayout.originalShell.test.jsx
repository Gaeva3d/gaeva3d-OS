import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

const shell = postcss.parse(readFileSync('src/styles/gaeva-shell.css', 'utf8'))
const topbar = postcss.parse(readFileSync('src/styles/gaeva-topbar.css', 'utf8'))
const declarations = (root, selector) => {
  const values = {}
  root.walkRules((rule) => {
    if (rule.selector === selector && rule.parent.type === 'root') {
      rule.walkDecls((decl) => { values[decl.prop] = decl.value })
    }
  })
  return values
}

describe('original painel-geral shared shell binding (source geometry, not rendered QA)', () => {
  it('uses original final light tokens and 60px shared header rhythm', () => {
    expect(declarations(shell, '.gaeva-shell')).toMatchObject({
      '--gaeva-background': '#f5f5f7', '--gaeva-sidebar-surface': '#f1f1f4',
      '--gaeva-border': '#dedee4', '--gaeva-muted': '#60606a',
      '--gaeva-blue': '#005dbb', '--gaeva-selection': '#e1ebfa',
      '--gaeva-gutter': 'clamp(16px, 2.25vw, 32px)', '--gaeva-header-height': '60px',
    })
    expect(declarations(shell, '.gaeva-sidebar > div:first-child')).toMatchObject({
      height: 'var(--gaeva-header-height)', 'min-height': 'var(--gaeva-header-height)', padding: '0 20px',
    })
    expect(declarations(topbar, '.gaeva-topbar.gaeva-topbar-v2')).toMatchObject({
      height: 'var(--gaeva-header-height)', 'min-height': 'var(--gaeva-header-height)', padding: '0 var(--gaeva-gutter)',
    })
  })
  it('restores original 244/76 sidebar widths and compact navigation with tinted selection', () => {
    expect(declarations(shell, '.gaeva-sidebar.w-64').width).toBe('244px')
    expect(declarations(shell, '.gaeva-sidebar.w-20').width).toBe('76px')
    expect(declarations(shell, '.gaeva-sidebar .nav-item, .gaeva-sidebar .nav-item-active')).toMatchObject({
      'min-height': '36px', padding: '7px 12px', 'border-radius': '10px', 'font-size': '13px',
    })
    expect(declarations(shell, '.gaeva-sidebar .nav-item-active')).toMatchObject({
      background: 'var(--gaeva-selection)', color: 'var(--gaeva-blue)',
    })
    expect(declarations(shell, '.gaeva-main').padding).toBe('20px var(--gaeva-gutter) 48px')
  })
  it('retains original dark shell tokens rather than a solid blue active row', () => {
    expect(declarations(shell, '.gaeva-shell[data-appearance="dark"]')).toMatchObject({
      '--gaeva-background': '#17171a', '--gaeva-sidebar-surface': '#202024',
      '--gaeva-border': '#3c3c44', '--gaeva-muted': '#b4b4be',
      '--gaeva-blue': '#72b7ff', '--gaeva-selection': '#263951',
    })
    expect(declarations(shell, '.gaeva-shell[data-appearance="dark"] .gaeva-sidebar .nav-item-active')).toMatchObject({
      background: 'var(--gaeva-selection)', color: 'var(--gaeva-blue)',
    })
  })
  it('keeps narrow header one row with compact controls and coarse-pointer target override', () => {
    expect(declarations(topbar, '.gaeva-topbar-v2 .gaeva-page-search')).toMatchObject({ height: '36px', 'min-height': '36px', 'border-radius': '999px' })
    const narrow = []
    topbar.walkAtRules('media', (media) => {
      if (media.params === '(max-width: 767px)') media.walkDecls('min-height', (decl) => narrow.push(decl.value))
    })
    expect(narrow).not.toContain('100px')
    expect(topbar.toString()).toContain('@media (any-pointer: coarse), (hover: none)')
    expect(topbar.toString()).toContain('min-width: 44px; min-height: 44px')
  })
})
