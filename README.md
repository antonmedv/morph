# @medv/morph

Lightweight DOM morphing. Updates the existing DOM tree to match a new one, minimizing the number of changes.

## Install

```bash
npm install @medv/morph
```

## Usage

```js
import { morph } from '@medv/morph'

const next =
  div({class: 'container'},
    text('Hello, '),
    strong({}, 'world!'))

const existing = document.querySelector('.container')

morph(existing, next)
```

The `morph` function updates `existing` in place to match `next`. It preserves existing DOM nodes where possible,
only updating attributes, text content, and children as needed.

## Notes

- **Form elements** are treated as uncontrolled. The morph syncs HTML attributes but does not update DOM properties like
  `input.value`, `input.checked`, or `option.selected`. If a user has interacted with a form field, the displayed state
  won't change.
- **Children are matched by position**, not by key (similar to key-less rendering in React). Reordering a list will
  update each child's content in place rather than moving DOM nodes, which means focus, selection, and CSS transitions
  won't follow the logical element.
- **Helper functions** are used to create DOM elements and text nodes. But they are not a necessity.
  ```js 
  function createElement(tag, attrs, ...children) {
    const e = document.createElement(tag)
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
    e.append(...children.filter(Boolean))
    return e
  }
  
  function div(attrs, ...children) {
    return createElement('div', attrs, ...children)
  }
  
  function strong(attrs, ...children) {
    return createElement('strong', attrs, ...children)
  }
  
  function text(t) {
    return document.createTextNode(t)
  }
  ```
## License

[MIT](LICENSE)
