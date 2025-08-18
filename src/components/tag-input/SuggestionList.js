import { Component, xml, useState, useEffect, useRef } from '@odoo/owl';
import { classNames } from '../../utils/classNames';

export class SuggestionList extends Component {
  static props = {
    items: { type: Array },
    onSelect: { type: Function },
    slots: { type: Object, optional: true },
    className: { type: String, optional: true },
  };

  static template = xml`
    <div class="${classNames('&suggestion-list')}" t-att-class="props.className" t-on-mousedown="(event) => event.preventDefault()" t-ref="list">
      <t t-slot="listHeader"/>

      <t t-if="props.items.length">
        <t t-foreach="props.items" t-as="item" t-key="item.value">
          <div
            t-att-class="{
              'is-selected': item.value === state.selectedItem?.value,
              'is-disabled': item.disabled,
            }"
            t-on-click="() => this.onSelect(item)"
            t-att-data-value="item.value"
          >
            <t t-slot="listItem" item="item">
              <t t-esc="item.label" />
            </t>
          </div>
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

  state = useState({
    selectedItem: null,
  });

  listRef = useRef('list');

  onSelect(item) {
    !item.disabled && this.props.onSelect(item);
  }

  setup() {
    useEffect(
      () => {
        const selectedItem = this.props.items.find((item) => !item.disabled) ?? null;
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

  onKeyDown = (event) => {
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
    const { items } = this.props;
    const { selectedItem } = this.state;
    const selectableItems = items.filter((item) => !item.disabled);
    if (!selectableItems.length) {
      return;
    }
    const selectedIndex = selectableItems.indexOf(selectedItem);
    const newIndex = (selectedIndex - 1 + selectableItems.length) % selectableItems.length;
    this.state.selectedItem = selectableItems[newIndex];
  }

  downHandler() {
    const { items } = this.props;
    const { selectedItem } = this.state;
    const selectableItems = items.filter((item) => !item.disabled);
    if (!selectableItems.length) {
      return;
    }
    const selectedIndex = selectableItems.indexOf(selectedItem);
    const newIndex = (selectedIndex + 1) % selectableItems.length;
    this.state.selectedItem = selectableItems[newIndex];
  }

  enterHandler(event) {
    if (this.state.selectedItem) {
      this.props.onSelect(event, this.state.selectedItem);
    }
  }

  scrollIntoView() {
    if (!this.listRef.el || !this.state.selectedItem) {
      return;
    }
    const selectedItemEl = this.listRef.el.querySelector(`[data-value="${this.state.selectedItem.value}"]`);

    if (selectedItemEl) {
      const listRect = this.listRef.el.getBoundingClientRect();
      const itemRect = selectedItemEl.getBoundingClientRect();
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
