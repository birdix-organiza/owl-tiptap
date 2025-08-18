# TagInput 组件文档

这是一个基于 Odoo Owl 和 Tiptap 实现的标签输入组件。

## 如何使用

```javascript
import { TagInput } from './path/to/TagInput';

// 在你的组件模板中使用
<TagInput props="tagInputProps" />
```

## Props

| 属性名 | 类型 | 是否可选 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| `ref` | `Function` | 是 | | 获取组件实例的回调函数。 |
| `placeholder` | `String` | 是 | `'请输入文本，按#选择标签...'` | 输入框的占位文本。 |
| `slots` | `Object` | 是 | | 用于自定义渲染建议列表项的插槽。包含 `listHeader`、`listItem`、`listEmpty` 和 `listFooter` 四个插槽。 |
| `suggestionListClassName` | `String` | 是 | | 应用于建议列表的自定义 CSS 类名。 |
| `onSuggestionSelect` | `Function` | 是 | | 当建议项被选中时触发的回调函数。接收 `(event, item)` 两个参数。可以通过在回调中调用 `event.stopPropagation()` 来阻止后续的默认选择行为。 |
| `items` | `Function` | 是 | `() => []` | 一个返回建议项数组的函数。该函数接收一个包含 `{ query: String }` 的对象作为参数，其中 `query` 是在 `#` 符号后输入的文本。数组中的每个对象必须包含 `value` 属性。 |

## 公共方法

### `getContent()`

序列化编辑器当前的内容。

-   **返回**: `{object}` - 内容的 JSON 对象。

### `setContent(content)`

将内容反序列化到编辑器中。

-   **参数**:
    -   `content` `{object}` - 要设置的内容，格式为 JSON 对象。