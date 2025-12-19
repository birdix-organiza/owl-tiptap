import { TagInput, type SuggestionItem, type ListItem, type GroupItem } from './TagInput';

// 示例1: 普通列表（保持原有结构）
const normalItems: SuggestionItem[] = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橙子' },
];

// 示例2: 分组列表（通过GroupItem结构）
const structuredGroupedItems: ListItem[] = [
  {
    group: '水果',
    items: [
      { value: 'apple', label: '苹果' },
      { value: 'banana', label: '香蕉' },
      { value: 'orange', label: '橙子' },
    ],
  },
  {
    group: '蔬菜',
    items: [
      { value: 'carrot', label: '胡萝卜' },
      { value: 'broccoli', label: '西兰花' },
      { value: 'tomato', label: '西红柿' },
    ],
  },
];

// 使用示例
export function ExampleUsage() {
  return {
    // 普通列表用法（与之前完全相同）
    normalTagInput: {
      items: ({ query }: { query: string }) => {
        return normalItems.filter((item) => item.label?.toLowerCase().includes(query.toLowerCase()));
      },
    },

    // 分组列表用法（通过GroupItem结构）
    structuredGroupedTagInput: {
      items: ({ query }: { query: string }) => {
        // 对于结构化分组，需要过滤每个分组内的项目
        return structuredGroupedItems
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.label?.toLowerCase().includes(query.toLowerCase())),
          }))
          .filter((group) => group.items.length > 0); // 只返回有匹配项的分组
      },
      // 自定义分组标题样式
      slots: {
        listGroupHeader: (item: GroupItem) => {
          return `<div style="color: #666; font-weight: bold; padding: 6px 8px; background: #f5f5f5;">${item.group}</div>`;
        },
      },
    },
  };
}
