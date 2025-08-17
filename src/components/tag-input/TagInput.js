import { Component, xml, useRef, onMounted, useEffect } from '@odoo/owl';
import { classNames } from '../../utils/classNames';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import './TagInput.scss';

export class TagInput extends Component {
  static props = {
    ref: { type: Function, optional: true },
  };

  static template = xml`
<div>
  <div class="${classNames('&tag-input')}" t-ref="editor"/> 
</div>
  `;

  editorRef = useRef('editor');

  setup() {
    onMounted(() => {
      this.props.ref?.(this);
    });

    useEffect(
      () => {
        this.editor = new Editor({
          element: this.editorRef.el,
          extensions: [StarterKit],
          content: '<p>Hello World!</p>',
        });
      },
      () => [],
    );
  }
}
