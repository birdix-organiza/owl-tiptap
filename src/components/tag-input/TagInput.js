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
    slots: { type: Object, optional: true },
    suggestionListClassName: { type: String, optional: true },
    onSuggestionSelect: { type: Function, optional: true },
    items: { type: Function, optional: true },
  };

  static template = xml`
<div class="${classNames('&tag-input')}">
  <div t-ref="editor"/>
  <div t-if="state.suggestion.visible" t-att-style="state.suggestion.style" class="ott-suggestion-list-wrapper">
    <SuggestionList
      className="props.suggestionListClassName"
      items="state.suggestion.items"
      onSelect.bind="onSuggestionSelect"
      slots="props.slots"
    />
  </div>
</div>
  `;

  static defaultProps = {
    items: () => [],
  };

  editorRef = useRef('editor');
  state = useState({
    suggestion: {
      visible: false,
      items: [],
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
              placeholder: this.props.placeholder || '请输入文本，按#选择标签...',
            }),
            TagNode,
            SuggestionPlugin.configure({
              items: this.props.items,
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
                    this.updateSuggestion(props, { visible: true });
                  },

                  onUpdate: (props) => {
                    this.updateSuggestion(props);
                  },

                  onExit: () => {
                    this.state.suggestion.visible = false;
                  },
                };
              },
            }),
          ],
          content: '',
          onBlur: () => {
            this.state.suggestion.visible = false;
          },
        });
      },
      () => [],
    );
  }

  onSuggestionSelect(event, item) {
    this.props.onSuggestionSelect?.(event, item);
    if (!event.cancelBubble) {
      this.state.suggestion.command(item);
      this.state.suggestion.visible = false;
    }
  }

  updateSuggestion(props, options) {
    const clientRect = props.clientRect();
    const editorRect = this.editorRef.el.getBoundingClientRect();
    const { innerHeight } = window;

    let style = '';
    if (clientRect.bottom + 200 > innerHeight) {
      style = `bottom: ${editorRect.height}px`;
    } else {
      style = `top: ${editorRect.height}`;
    }

    this.state.suggestion = {
      ...this.state.suggestion,
      items: props.items,
      command: props.command,
      style,
      ...options,
    };
  }

  /**
   * Serializes the current content of the editor.
   * @returns {object} The content as a JSON object.
   */
  getContent() {
    return this.editor.getJSON();
  }

  /**
   * Deserializes content into the editor.
   * @param {object} content - The content to set, as a JSON object.
   */
  setContent(content) {
    this.editor.commands.setContent(content);
  }
}
