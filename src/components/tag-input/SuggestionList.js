import { Component, xml } from '@odoo/owl';
import { classNames } from '../../utils/classNames';

export class SuggestionList extends Component {
  static template = xml`
    <div class="${classNames('&suggestion-list')}">
      <t t-if="props.items.length">
        <t t-foreach="props.items" t-as="item" t-key="item.value">
          <div
            class="{ 'is-selected': item === props.selectedItem }"
            t-on-click="() => this.props.onSelect(item)"
          >
            <t t-esc="item.label" />
          </div>
        </t>
      </t>
      <t t-else="">
        <div class="is-empty">
          No results
        </div>
      </t>
    </div>
  `;

  static props = {
    items: { type: Array },
    selectedItem: { type: Object, optional: true },
    onSelect: { type: Function },
  };
}
