# @medv/morph

Lightweight DOM morphing. Updates the existing DOM tree to match a new one, minimizing the number of changes.

## Install

```bash
npm install @medv/morph
```

## Usage

```js
import {morph} from '@medv/morph'

morph(existingNode, newNode)
```

The `morph` function updates `existingNode` in place to match `newNode`. It preserves existing DOM nodes where possible,
only updating attributes, text content, and children as needed.

## License

[MIT](LICENSE)
