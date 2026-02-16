export function morph(from, to) {
  if (from.nodeType !== to.nodeType) {
    from.replaceWith(to.cloneNode(true))
    return
  }
  if (from.nodeType === Node.TEXT_NODE || from.nodeType === Node.COMMENT_NODE) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue
    return
  }
  if (from.nodeType === Node.ELEMENT_NODE) {
    if (from.tagName !== to.tagName) {
      from.replaceWith(to.cloneNode(true))
      return
    }
    syncAttributes(from, to)
    syncChildren(from, to)
    return
  }
  from.replaceWith(to.cloneNode(true))
}

function syncAttributes(fromEl, toEl) {
  for (const {name} of Array.from(fromEl.attributes)) {
    if (!toEl.hasAttribute(name)) fromEl.removeAttribute(name)
  }
  for (const {name, value} of Array.from(toEl.attributes)) {
    if (fromEl.getAttribute(name) !== value) fromEl.setAttribute(name, value)
  }
}

function syncChildren(fromEl, toEl) {
  const fromKids = Array.from(fromEl.childNodes)
  const toKids = Array.from(toEl.childNodes)
  const commonLen = Math.min(fromKids.length, toKids.length)
  for (let i = 0; i < commonLen; i++) {
    morph(fromKids[i], toKids[i])
  }
  for (let i = fromKids.length - 1; i >= toKids.length; i--) {
    fromEl.removeChild(fromKids[i])
  }
  for (let i = commonLen; i < toKids.length; i++) {
    fromEl.appendChild(toKids[i].cloneNode(true))
  }
}
