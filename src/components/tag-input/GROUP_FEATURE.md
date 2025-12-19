# TagInput 分组功能

TagInput 组件现在支持分组显示，同时保持与原有结构的完全兼容。

## 基本用法

### 普通列表（原有功能）

```typescript
import { TagInput, SuggestionItem } from './TagInput';

const items: SuggestionItem[] = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橙子' },
];

<TagInput
  items={({ query }) => items.filter(item => 
    item.label?.toLowerCase().includes(query.toLowerCase())
  )}
/>
```

## 分组方式：通过 GroupItem 结构

```typescript
import { TagInput, GroupItem, ListItem } from './TagInput';

const structuredGroupedItems: ListItem[] = [
  {
    group: '水果',
    items: [
      { value: 'apple', label: '苹果' },
      { value: 'banana', label: '香蕉' },
      { value: 'orange', label: '橙子' },
    ]
  },
  {
    group: '蔬菜',
    items: [
      { value: 'carrot', label: '胡萝卜' },
      { value: 'broccoli', label: '西兰花' },
      { value: 'tomato', label: '西红柿' },
    ]
  },
];

<TagInput
  items={({ query }) => {
    // 对于结构化分组，需要过滤每个分组内的项目
    return structuredGroupedItems.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.label?.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(group => group.items.length > 0); // 只返回有匹配项的分组
  }}
/>
```

## 接口定义

### SuggestionItem 接口

```typescript
interface SuggestionItem {
  value: string;
  label?: string;
  disabled?: boolean;
  [key: string]: any; // 允许其他属性
}
```

### GroupItem 接口

```typescript
interface GroupItem {
  group: string; // 分组名称
  items: SuggestionItem[]; // 分组内的项目
  [key: string]: any; // 允许其他属性
}
```

### ListItem 类型

```typescript
type ListItem = SuggestionItem | GroupItem; // 可以是普通项或分组项
```

## 自定义分组标题样式

```typescript
<TagInput
  items={({ query }) => {
    // 过滤逻辑...
  }}
  slots={{
    listGroupHeader: (item: GroupItem) => {
      return `<div class="custom-group-header">${item.group}</div>`;
    }
  }}
/>
```

## 样式

分组标题的默认样式：

```scss
.is-group-header {
  font-weight: bold;
  color: var(--ott-text-color-secondary);
  background-color: #f5f5f5;
  cursor: default;
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
  margin-top: 3px;

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background-color: #f5f5f5;
    color: var(--ott-text-color-secondary);
  }
}
```

## 注意事项

1. 分组标题不可选择，仅用于视觉分组
2. 键盘导航会跳过分组标题
3. 普通列表和分组列表可以混合使用，组件会自动检测数据结构
4. 搜索过滤时，对于分组列表需要手动处理每个分组内的过滤逻辑
5. 分组标题会自动显示，无需手动创建
6. 如果分组内没有匹配项，建议在过滤时移除该分组