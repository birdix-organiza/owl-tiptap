# TagInput 组件文档

这是一个基于 Odoo Owl 和 Tiptap 实现的标签输入组件。

## 如何使用

```typescript
import { TagInput } from './path/to/TagInput';

// 在你的组件模板中使用
<TagInput props="tagInputProps" />
```

## Props

| 属性名 | 类型 | 是否可选 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| `ref` | `(component: TagInput) => void` | 是 | | 获取组件实例的回调函数。 |
| `placeholder` | `string` | 是 | `'请输入文本，按@选择标签...'` | 输入框的占位文本。 |
| `slots` | `Object` | 是 | | 用于自定义渲染建议列表项的插槽。包含 `listHeader`、`listItem`、`listEmpty` 和 `listFooter` 四个插槽。 |
| `suggestionListClassName` | `string` | 是 | | 应用于建议列表的自定义 CSS 类名。 |
| `onSuggestionSelect` | `(event: MouseEvent, item: SuggestionItem) => void` | 是 | | 当建议项被选中时触发的回调函数。接收 `(event, item)` 两个参数。可以通过在回调中调用 `event.stopPropagation()` 来阻止后续的默认选择行为。 |
| `items` | `(params: { query: string }) => SuggestionItem[]` | 是 | `() => []` | 一个返回建议项数组的函数。该函数接收一个包含 `{ query: string }` 的对象作为参数，其中 `query` 是在触发字符后输入的文本。数组中的每个对象必须包含 `value` 属性。 |
| `onChange` | `(content: any) => void` | 是 | | 当编辑器内容发生变化时触发的回调函数。 |
| `readonly` | `boolean` | 是 | `false` | 是否将编辑器设置为只读模式。 |
| `onTagClick` | `(index: number, attrs: TagAttributes) => void` | 是 | | 当标签被点击时触发的回调函数。 |
| `char` | `string` | 是 | `'@'` | 触发建议列表的字符，默认为 `@`。 |

## 类型定义

### `SuggestionItem`

建议项的类型定义：

```typescript
interface SuggestionItem {
  value: string;
  label?: string;
  disabled?: boolean;
  [key: string]: any; // 允许其他属性
}
```

### `TagAttributes`

标签属性的类型定义：

```typescript
interface TagAttributes {
  value: string;
  label?: string;
  group?: string;
  [key: string]: any; // 允许其他属性
}
```

### `TagNode`

标签节点的类型定义：

```typescript
interface TagNode {
  node: any;
  pos: number;
}
```

## 公共方法

### `getContent()`

序列化编辑器当前的内容。

-   **返回**: `any` - 内容的 JSON 对象。

### `setContent(content)`

将内容反序列化到编辑器中。

-   **参数**:
    -   `content` `any` - 要设置的内容，格式为 JSON 对象。

### `addTag(range, props)`

向编辑器中添加一个标签。

-   **参数**:
    -   `range` `{ from: number; to: number }` - 标签的范围
    -   `props` `TagAttributes` - 标签的属性

### `removeTag(index)`

根据索引从编辑器中移除标签。

-   **参数**:
    -   `index` `number` - 要移除的标签的索引

### `replaceTag(index, props)`

用新标签替换指定索引处的标签。

-   **参数**:
    -   `index` `number` - 要替换的标签的索引
    -   `props` `TagAttributes` - 新标签的属性

### `getTags()`

从编辑器中获取所有标签节点。

-   **返回**: `TagNode[]` - 包含位置信息的标签节点数组