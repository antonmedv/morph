export function morph(from, to) {
  if (from.nodeType !== to.nodeType) {
    from.replaceWith(to)
    return
  }
  if (from.nodeType === Node.TEXT_NODE || from.nodeType === Node.COMMENT_NODE) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue
    return
  }
  if (from.nodeType === Node.ELEMENT_NODE) {
    if (from.tagName !== to.tagName) {
      from.replaceWith(to)
      return
    }
    syncAttributes(from, to)
    syncChildren(from, to)
    return
  }
  from.replaceWith(to)
}

function syncAttributes(from, to) {
  for (const {name} of Array.from(from.attributes)) {
    if (!to.hasAttribute(name)) from.removeAttribute(name)
  }
  for (const {name, value} of Array.from(to.attributes)) {
    if (from.getAttribute(name) !== value) from.setAttribute(name, value)
  }
}

function syncChildren(from, to) {
  const fromKids = Array.from(from.childNodes)
  const toKids = Array.from(to.childNodes)
  const commonLen = Math.min(fromKids.length, toKids.length)
  for (let i = 0; i < commonLen; i++) {
    morph(fromKids[i], toKids[i])
  }
  for (let i = fromKids.length - 1; i >= toKids.length; i--) {
    from.removeChild(fromKids[i])
  }
  for (let i = commonLen; i < toKids.length; i++) {
    from.appendChild(toKids[i])
  }
}
