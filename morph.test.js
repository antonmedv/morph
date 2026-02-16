import {describe, it, expect, beforeEach} from 'vitest'
import {JSDOM} from 'jsdom'
import {morph} from './morph.js'

let document

beforeEach(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  document = dom.window.document
  globalThis.Node = dom.window.Node
})

function html(str) {
  const tpl = document.createElement('template')
  tpl.innerHTML = str.trim()
  return tpl.content.firstChild
}

describe('morph', () => {
  it('updates text content', () => {
    const from = html('<div>hello</div>')
    const to = html('<div>world</div>')
    morph(from, to)
    expect(from.textContent).toBe('world')
  })

  it('preserves the original element reference', () => {
    const from = html('<div>old</div>')
    const ref = from
    morph(from, html('<div>new</div>'))
    expect(ref.textContent).toBe('new')
    expect(from).toBe(ref)
  })

  it('replaces element when tag names differ', () => {
    const from = html('<div>hello</div>')
    const parent = document.createElement('div')
    parent.appendChild(from)
    const to = html('<span>hello</span>')
    morph(from, to)
    expect(parent.firstChild.tagName).toBe('SPAN')
  })

  it('replaces node when node types differ', () => {
    const parent = document.createElement('div')
    const text = document.createTextNode('hello')
    parent.appendChild(text)
    const to = html('<span>hi</span>')
    morph(text, to)
    expect(parent.firstChild.tagName).toBe('SPAN')
  })

  it('adds attributes', () => {
    const from = html('<div></div>')
    const to = html('<div class="foo" id="bar"></div>')
    morph(from, to)
    expect(from.getAttribute('class')).toBe('foo')
    expect(from.getAttribute('id')).toBe('bar')
  })

  it('removes attributes', () => {
    const from = html('<div class="foo" id="bar"></div>')
    const to = html('<div></div>')
    morph(from, to)
    expect(from.hasAttribute('class')).toBe(false)
    expect(from.hasAttribute('id')).toBe(false)
  })

  it('updates attributes', () => {
    const from = html('<div class="foo"></div>')
    const to = html('<div class="bar"></div>')
    morph(from, to)
    expect(from.getAttribute('class')).toBe('bar')
  })

  it('adds children', () => {
    const from = html('<ul></ul>')
    const to = html('<ul><li>one</li><li>two</li></ul>')
    morph(from, to)
    expect(from.children.length).toBe(2)
    expect(from.children[0].textContent).toBe('one')
    expect(from.children[1].textContent).toBe('two')
  })

  it('removes children', () => {
    const from = html('<ul><li>one</li><li>two</li></ul>')
    const to = html('<ul></ul>')
    morph(from, to)
    expect(from.children.length).toBe(0)
  })

  it('updates children in place', () => {
    const from = html('<ul><li>one</li><li>two</li></ul>')
    const firstLi = from.children[0]
    const to = html('<ul><li>ONE</li><li>TWO</li></ul>')
    morph(from, to)
    expect(from.children[0]).toBe(firstLi)
    expect(from.children[0].textContent).toBe('ONE')
    expect(from.children[1].textContent).toBe('TWO')
  })

  it('handles nested structures', () => {
    const from = html('<div><p><span>old</span></p></div>')
    const to = html('<div><p><span>new</span></p></div>')
    morph(from, to)
    expect(from.querySelector('span').textContent).toBe('new')
  })

  it('morphs comment nodes', () => {
    const parent = document.createElement('div')
    const comment = document.createComment('old')
    parent.appendChild(comment)
    const newComment = document.createComment('new')
    morph(comment, newComment)
    expect(parent.firstChild.nodeValue).toBe('new')
  })

  it('handles empty to non-empty', () => {
    const from = html('<div></div>')
    const to = html('<div><p>hello</p></div>')
    morph(from, to)
    expect(from.innerHTML).toBe('<p>hello</p>')
  })

  it('handles non-empty to empty', () => {
    const from = html('<div><p>hello</p></div>')
    const to = html('<div></div>')
    morph(from, to)
    expect(from.innerHTML).toBe('')
  })

  it('handles mixed child node types', () => {
    const from = html('<div>text<span>el</span></div>')
    const to = html('<div>new text<b>bold</b></div>')
    morph(from, to)
    expect(from.childNodes[0].nodeValue).toBe('new text')
    expect(from.childNodes[1].tagName).toBe('B')
  })

  it('does not modify when trees are identical', () => {
    const from = html('<div class="x"><span>hi</span></div>')
    const span = from.querySelector('span')
    const to = html('<div class="x"><span>hi</span></div>')
    morph(from, to)
    expect(from.querySelector('span')).toBe(span)
    expect(from.outerHTML).toBe('<div class="x"><span>hi</span></div>')
  })
})
