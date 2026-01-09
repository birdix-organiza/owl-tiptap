import { Component, xml, useState, useEffect, useRef } from '@odoo/owl';
import { classNames } from '../../utils/classNames';

// 定义建议项的类型
export interface SuggestionItem {
  value: string;
  label?: string;
  disabled?: boolean;
  [key: string]: any; // 允许其他属性
}

// 定义分组项的类型
export interface GroupItem {
  group: string; // 分组名称
  items: SuggestionItem[]; // 分组内的项目
  [key: string]: any; // 允许其他属性
}

// 定义可以是普通项或分组项的类型
export type ListItem = SuggestionItem | GroupItem;

// 定义组件 Props 的类型
interface SuggestionListProps {
  items: ListItem[]; // 可以是普通项或分组项
  onSelect: (event: MouseEvent, item: SuggestionItem) => void;
  slots?: {
    listHeader?: any;
    listItem?: any;
    listGroupHeader?: any; // 分组标题插槽
    listEmpty?: any;
    listFooter?: any;
  };
  className?: string;
}

// 定义组件状态的类型
interface SuggestionListState {
  selectedItem: SuggestionItem | null;
}

export class SuggestionList extends Component<SuggestionListProps> {
  static props = {
    items: { type: Array },
    onSelect: { type: Function },
    slots: { type: Object, optional: true },
    className: { type: String, optional: true },
  };

  /**
   * 检查项目是否为分组项
   */
  private isGroupItem(item: ListItem): item is GroupItem {
    return item && typeof item === 'object' && 'group' in item;
  }

  /**
   * 获取处理后的项目列表
   */
  get processedItems(): ListItem[] {
    console.log(this.props.items);

    // 检查是否有分组项结构
    const hasGroupItems = this.props.items.some((item) => this.isGroupItem(item));

    // 如果有分组项，则直接返回
    if (hasGroupItems) {
      return this.props.items;
    }

    // 否则返回原始项目（普通列表）
    return this.props.items;
  }

  static template = xml`
    <div class="${classNames('&suggestion-list')}" t-att-class="props.className" t-on-mousedown="(event) => event.preventDefault()" t-ref="list">
      <t t-slot="listHeader"/>

      <t t-if="processedItems.length">
        <t t-foreach="processedItems" t-as="item" t-key="item.value || item.group">
          <!-- 分组项 -->
          <t t-if="this.isGroupItem(item)">
            <div class="${classNames('&suggestion-header')}">
              <t t-slot="listGroupHeader" item="item">
                <span t-esc="item.group" />
                <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15717" width="200" height="200"><path d="M320 928c-9.6 0-16-3.2-22.4-9.6-12.8-12.8-12.8-32 0-44.8L659.2 512 297.6 150.4c-12.8-12.8-12.8-32 0-44.8s32-12.8 44.8 0l384 384c12.8 12.8 12.8 32 0 44.8l-384 384c-6.4 6.4-12.8 9.6-22.4 9.6z" fill="#333333" p-id="15718"></path></svg>
              </t>
            </div>
            <t t-foreach="item.items" t-as="subItem" t-key="subItem.value">
              <div
                t-att-class="{
                  'is-selected': subItem.value === state.selectedItem?.value,
                  'is-disabled': subItem.disabled,
                }"
                t-on-click="(ev) => this.onSelect(ev, subItem)"
                t-att-data-value="subItem.value"
              >
                <t t-slot="listItem" item="subItem">
                  <t t-esc="subItem.label" />
                </t>
              </div>
            </t>
          </t>
          <!-- 普通项 -->
          <t t-else="">
            <div
              t-att-class="{
                'is-selected': item.value === state.selectedItem?.value,
                'is-disabled': item.disabled,
              }"
              t-on-click="(ev) => this.onSelect(ev, item)"
              t-att-data-value="item.value"
            >
              <t t-slot="listItem" item="item">
                <t t-esc="item.label" />
              </t>
            </div>
          </t>
        </t>
      </t>

      <t t-else="">
        <div class="is-empty">
          <t t-slot="listEmpty" item="item">
            没有匹配项
          </t>
        </div>
      </t>

      <t t-slot="listFooter"/>
    </div>
  `;

  state = useState<SuggestionListState>({
    selectedItem: null,
  });

  listRef = useRef('list');

  onSelect(ev: MouseEvent, item: SuggestionItem) {
    if (!item.disabled) {
      this.props.onSelect?.(ev, item);
    }
  }

  setup() {
    useEffect(
      () => {
        // 找到第一个非禁用且非分组标题的项
        let selectedItem: SuggestionItem | null = null;

        for (const item of this.processedItems) {
          if (this.isGroupItem(item)) {
            // 如果是分组项，查找分组内的第一个非禁用项
            const firstSelectable = item.items.find((subItem) => !subItem.disabled);
            if (firstSelectable) {
              selectedItem = firstSelectable;
              break;
            }
          } else {
            // 如果是普通项且非禁用
            selectedItem = item;
            break;
          }
        }

        if (this.state.selectedItem?.value !== selectedItem?.value) {
          this.state.selectedItem = selectedItem;
        }
      },
      () => [this.props.items],
    );

    useEffect(
      () => {
        window.addEventListener('keydown', this.onKeyDown, true);

        return () => {
          window.removeEventListener('keydown', this.onKeyDown, true);
        };
      },
      () => [this.props.items],
    );

    useEffect(() => {
      this.scrollIntoView();
    });
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      this.upHandler();
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (event.key === 'ArrowDown') {
      this.downHandler();
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (event.key === 'Enter') {
      this.enterHandler(event);
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  upHandler() {
    const { selectedItem } = this.state;
    // 收集所有可选择的项目
    const selectableItems: SuggestionItem[] = [];

    for (const item of this.processedItems) {
      if (this.isGroupItem(item)) {
        // 如果是分组项，添加分组内的非禁用项
        selectableItems.push(...item.items.filter((subItem) => !subItem.disabled));
      } else {
        // 如果是普通项且非禁用
        selectableItems.push(item);
      }
    }

    if (!selectableItems.length) {
      return;
    }

    const selectedIndex = selectableItems.findIndex((item) => item.value === selectedItem?.value);
    const newIndex = (selectedIndex - 1 + selectableItems.length) % selectableItems.length;
    this.state.selectedItem = selectableItems[newIndex];
  }

  downHandler() {
    const { selectedItem } = this.state;
    // 收集所有可选择的项目
    const selectableItems: SuggestionItem[] = [];

    for (const item of this.processedItems) {
      if (this.isGroupItem(item)) {
        // 如果是分组项，添加分组内的非禁用项
        selectableItems.push(...item.items.filter((subItem) => !subItem.disabled));
      } else {
        // 如果是普通项且非禁用
        selectableItems.push(item);
      }
    }

    if (!selectableItems.length) {
      return;
    }
    const selectedIndex = selectableItems.findIndex((item) => item.value === selectedItem?.value);
    const newIndex = (selectedIndex + 1) % selectableItems.length;
    this.state.selectedItem = selectableItems[newIndex];
  }

  enterHandler(event: KeyboardEvent) {
    if (this.state.selectedItem) {
      this.props.onSelect(event as any, this.state.selectedItem);
    }
  }

  scrollIntoView() {
    if (!this.listRef.el || !this.state.selectedItem) {
      return;
    }
    const selectedItemEl = this.listRef.el.querySelector(`[data-value="${this.state.selectedItem.value}"]`);

    if (selectedItemEl) {
      const listRect = this.listRef.el.getBoundingClientRect();
      const itemRect = (selectedItemEl as Element).getBoundingClientRect();
      const listStyle = window.getComputedStyle(this.listRef.el);
      const paddingTop = parseFloat(listStyle.paddingTop);
      const paddingBottom = parseFloat(listStyle.paddingBottom);

      if (itemRect.bottom > listRect.bottom - paddingBottom) {
        this.listRef.el.scrollTop += itemRect.bottom - (listRect.bottom - paddingBottom);
      } else if (itemRect.top < listRect.top + paddingTop) {
        this.listRef.el.scrollTop -= listRect.top + paddingTop - itemRect.top;
      }
    }
  }
}
