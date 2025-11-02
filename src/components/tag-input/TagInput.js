import { Component, xml, useRef, onMounted, useEffect, useState, markRaw } from '@odoo/owl';
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
    onChange: { type: Function, optional: true },
    readonly: { type: Boolean, optional: true },
    onTagClick: { type: Function, optional: true },
  };

  static template = xml`
<div class="${classNames('&tag-input')}">
  <div t-ref="editor"/>
  <div t-if="state.suggestion.visible" t-att-disabled="props.readonly" t-att-style="state.suggestion.style" class="ott-suggestion-list-wrapper">
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
    readonly: false,
  };

  editorRef = useRef('editor');
  state = useState({
    editor: null,
    suggestion: {
      visible: false,
      range: {
        from: 0,
        to: 0,
      },
      items: [],
      style: '',
    },
  });

  onSuggestionSelect(event, item) {
    this.props.onSuggestionSelect?.(event, item);
    if (!event.cancelBubble) {
      this.addTag(this.state.suggestion.range, item);
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
      range: props.range,
      items: props.items,
      style,
      ...options,
    };
  }

  /**
   * Serializes the current content of the editor.
   * @returns {object} The content as a JSON object.
   */
  getContent() {
    return this.state.editor.getJSON();
  }

  /**
   * Deserializes content into the editor.
   * @param {object} content - The content to set, as a JSON object.
   */
  setContent(content) {
    this.state.editor.commands.setContent(content);
  }

  /**
   * Adds a tag to the editor.
   * @param {object} range - The range of the tag
   * @param {number} range.from - The start position of the tag.
   * @param {number} range.to - The end position of the tag.
   * @param {object} props - The properties of the tag.
   */
  addTag(range, props) {
    this.state.editor
      .chain()
      .focus()
      .insertContentAt(range, {
        type: 'tag',
        attrs: props,
      })
      .run();
  }

  /**
   * Removes a tag from the editor by its index.
   * @param {number} index - The index of the tag to remove.
   */
  removeTag(index) {
    const tags = this.getTags();
    const tagToRemove = tags[index];
    if (tagToRemove) {
      const { node, pos } = tagToRemove;
      const from = pos;
      const to = pos + node.nodeSize;
      this.state.editor.chain().focus().deleteRange({ from, to }).run();
    }
  }

  /**
   * Replaces a tag at a specific index with a new tag.
   * @param {number} index - The index of the tag to replace.
   * @param {object} props - The properties of the new tag.
   */
  replaceTag(index, props) {
    const tags = this.getTags();
    const tagToReplace = tags[index];
    if (tagToReplace) {
      const { node, pos } = tagToReplace;
      const from = pos;
      const to = pos + node.nodeSize;
      this.state.editor
        .chain()
        .focus()
        .insertContentAt(
          { from, to },
          {
            type: 'tag',
            attrs: props,
          },
        )
        .run();
    }
  }

  /**
   * Gets all tag nodes from the editor.
   * @returns {Array} An array of tag nodes with their positions.
   */
  getTags() {
    const tags = [];
    this.state.editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'tag') {
        tags.push({ node, pos });
      }
    });
    return tags;
  }

  setup() {
    onMounted(() => {
      this.props.ref?.(this);
    });

    useEffect(
      () => {
        if (this.state.editor) {
          this.state.editor.setEditable(!this.props.readonly);
        }
      },
      () => [this.props.readonly, this.state.editor],
    );

    useEffect(
      () => {
        this.state.editor = markRaw(
          new Editor({
            element: this.editorRef.el,
            extensions: [
              StarterKit,
              Placeholder.configure({
                placeholder: this.props.placeholder || '请输入文本，按#选择标签...',
              }),
              TagNode.configure({
                onTagClick: (attrs, pos) => {
                  if (this.props.onTagClick) {
                    const tags = this.getTags();
                    const index = tags.findIndex((tag) => tag.pos === pos);
                    if (index !== -1) {
                      this.props.onTagClick(index, attrs);
                    }
                  }
                },
              }),
              SuggestionPlugin.configure({
                items: this.props.items,
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
            onUpdate: ({ editor, transaction }) => {
              if (transaction.docChanged) {
                this.props.onChange?.(editor.getJSON());
              }
            },
          }),
        );
      },
      () => [],
    );
  }
}
