import { Component, mount, xml } from '@odoo/owl';
import { TagInput } from '../src';

class App extends Component {
  static components = {
    TagInput,
  };

  static template = xml`
<div style="width: 100%; height: 100%;padding: 20px;box-sizing: border-box;background: #f5f5f5;">
  <TagInput ref="(i) => this.tagInputInstance = i" items="items"/>
</div>
`;

  tagInputInstance = undefined;

  items = ({ editor, query }) => {
    // Now we return complex objects
    const items = [
      { label: '中文标题', value: 'apple', group: 'Fruit' },
      { label: '产品名称', value: 'banana', group: 'Fruit' },
      { label: 'Carrot', value: 'carrot', group: 'Vegetable' },
      { label: 'Donut', value: 'donut', group: 'Snack' },
      { label: 'Egg', value: 'egg', group: 'Snack' },
      { label: 'Fish', value: 'fish', group: 'Snack' },
      { label: 'Grape', value: 'grape', group: 'Fruit' },
      { label: 'Pear', value: 'pear', group: 'Fruit' },
      { label: 'Potato', value: 'potato', group: 'Vegetable' },
      { label: 'Tomato', value: 'tomato', group: 'Vegetable' },
      { label: 'Watermelon', value: 'watermelon', group: 'Fruit' },
      { label: 'Apple', value: 'apple1', group: 'Fruit' },
    ];
    return items.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()));
  };

  setup() {
    // @ts-ignore
    window.getJson = () => {
      return this.tagInputInstance.getContent();
    };

    // @ts-ignore
    window.loadJson = () => {
      this.tagInputInstance.setContent({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'adf',
              },
              {
                type: 'tag',
                attrs: {
                  value: 'apple',
                  label: 'Apple',
                  group: 'Fruit',
                },
              },
              {
                type: 'tag',
                attrs: {
                  value: 'banana',
                  label: 'Banana',
                  group: 'Fruit',
                },
              },
            ],
          },
        ],
      });
    };
  }
}

/**
 * Render the Root component in the given element
 * @param el {HTMLElement}
 */
const render = async (el) => {
  return await mount(App, el, {
    dev: true,
  });
};

render(document.getElementById('app'));
