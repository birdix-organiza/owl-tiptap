import { Component, mount, xml, useState, useEffect } from '@odoo/owl';
import { TagInput } from '../src';

class App extends Component {
  static components = {
    TagInput,
  };

  static template = xml`
<div style="width: 100%; height: 100%;padding: 20px;box-sizing: border-box;background: #f5f5f5;">
  <TagInput ref="(i) => this.tagInputInstance = i" items="items" onChange.bind="onChange" readonly="state.readonly"/>
</div>
`;

  tagInputInstance = undefined;

  state = useState({
    readonly: false,
  });

  items = ({ editor, query }) => {
    // Now we return complex objects
    const items = [
      { label: '中文标题', value: 'apple', group: 'Fruit' },
      { label: '产品名称', value: 'banana', group: 'Fruit' },
      { label: 'Carrot', value: 'carrot', group: 'Vegetable' },
      { label: 'Donut', value: 'donut', group: 'Snack', disabled: true },
      { label: 'Egg', value: 'egg', group: 'Snack' },
      { label: 'Fish', value: 'fish', group: 'Snack' },
      { label: 'Grape', value: 'grape', group: 'Fruit' },
      { label: 'Pear', value: 'pear', group: 'Fruit' },
      { label: 'Potato', value: 'potato', group: 'Vegetable' },
      { label: 'Tomato', value: 'tomato', group: 'Vegetable' },
      { label: 'Watermelon', value: 'watermelon', group: 'Fruit' },
      { label: 'Apple', value: 'apple1', group: 'Fruit' },
    ];
    const items2 = [
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
    return items2
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase())),
      }))
      .filter((group) => group.items.length > 0);
    return items.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()));
  };

  onChange(content) {
    console.log(content);
  }

  setup() {
    useEffect(
      () => {
        // @ts-ignore
        window.setContent();
      },
      () => [],
    );

    // @ts-ignore
    window.getContent = () => {
      return this.tagInputInstance.getContent();
    };

    // @ts-ignore
    window.removeTag = (index) => {
      this.tagInputInstance.removeTag(index);
    };

    // @ts-ignore
    window.replaceTag = (index, props) => {
      this.tagInputInstance.replaceTag(index, props);
    };

    // @ts-ignore
    window.setContent = () => {
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
