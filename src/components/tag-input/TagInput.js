import { Component, xml, useRef, onMounted, useEffect, useState } from '@odoo/owl';
import { classNames } from '../../utils/classNames';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { SuggestionList } from './SuggestionList';
import { TagNode } from './TagNode';
import { SuggestionPlugin } from './suggestion';
import './TagInput.scss';

export class TagInput extends Component {
  static components = { SuggestionList };
  static props = {
    ref: { type: Function, optional: true },
    placeholder: { type: String, optional: true },
  };

  static template = xml`
<div class="${classNames('&tag-input')}">
  <div t-ref="editor"/>
  <div t-if="state.suggestion.visible" t-att-style="state.suggestion.style">
    <SuggestionList
      items="state.suggestion.items"
      selectedItem="state.suggestion.selectedItem"
      onSelect.alike="(item) => this.onSuggestionSelect(item)"
    />
  </div>
</div>
  `;

  editorRef = useRef('editor');
  state = useState({
    suggestion: {
      visible: false,
      items: [],
      selectedItem: null,
      command: (props) => {},
      style: '',
    },
  });

  setup() {
    onMounted(() => {
      this.props.ref?.(this);
    });

    useEffect(
      () => {
        this.editor = new Editor({
          element: this.editorRef.el,
          extensions: [
            StarterKit,
            Placeholder.configure({
              placeholder: this.props.placeholder || 'Enter text...',
            }),
            TagNode,
            SuggestionPlugin.configure({
              items: ({ query }) => {
                // Now we return complex objects
                const items = [
                  { label: 'Apple', value: 'apple', group: 'Fruit' },
                  { label: 'Banana', value: 'banana', group: 'Fruit' },
                  { label: 'Carrot', value: 'carrot', group: 'Vegetable' },
                  { label: 'Donut', value: 'donut', group: 'Snack' },
                ];
                return items.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
              },
              command: ({ editor, range, props }) => {
                editor
                  .chain()
                  .focus()
                  .insertContentAt(range, {
                    type: 'tag',
                    attrs: props,
                  })
                  .run();
              },
              render: () => {
                return {
                  onStart: (props) => {
                    const rect = props.clientRect();
                    this.state.suggestion = {
                      ...this.state.suggestion,
                      visible: true,
                      items: props.items,
                      selectedItem: props.items[0],
                      command: props.command,
                      style: `top: ${rect.bottom}px; left: ${rect.left}px;`,
                    };
                  },

                  onUpdate: (props) => {
                    const rect = props.clientRect();
                    this.state.suggestion = {
                      ...this.state.suggestion,
                      items: props.items,
                      selectedItem: props.items[0],
                      command: props.command,
                      style: `top: ${rect.bottom}px; left: ${rect.left}px;`,
                    };
                  },

                  onKeyDown: ({ event }) => {
                    const { items, selectedItem } = this.state.suggestion;
                    const selectedIndex = items.indexOf(selectedItem);

                    if (event.key === 'ArrowUp') {
                      const newIndex = (selectedIndex - 1 + items.length) % items.length;
                      this.state.suggestion.selectedItem = items[newIndex];
                      return true;
                    }

                    if (event.key === 'ArrowDown') {
                      const newIndex = (selectedIndex + 1) % items.length;
                      this.state.suggestion.selectedItem = items[newIndex];
                      return true;
                    }

                    if (event.key === 'Enter') {
                      this.onSuggestionSelect(this.state.suggestion.selectedItem);
                      return true;
                    }

                    return false;
                  },

                  onExit: () => {
                    this.state.suggestion.visible = false;
                  },
                };
              },
            }),
          ],
          content: '',
        });
      },
      () => [],
    );
  }

  onSuggestionSelect(item) {
    this.state.suggestion.command(item);
    this.state.suggestion.visible = false;
  }
}
