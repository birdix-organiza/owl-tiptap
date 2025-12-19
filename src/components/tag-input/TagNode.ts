import { Node, mergeAttributes } from '@tiptap/core';
import { TagAttributes } from './TagInput';

const closeSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

// 定义 TagNode 选项的类型
interface TagNodeOptions {
  onTagClick: (attrs: TagAttributes, pos: number) => void;
  renderLabel?: (attrs: TagAttributes) => string;
  readonly?: boolean;
}

export const TagNode = Node.create<TagNodeOptions>({
  name: 'tag',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions(): TagNodeOptions {
    return {
      onTagClick: () => {},
      readonly: false, // 默认不只读
    };
  },

  addAttributes() {
    return {
      value: {
        default: null,
      },
      label: {
        default: null,
      },
      group: {
        default: null,
      },
    };
  },

  addNodeView() {
    // We can implement an Owl NodeView here later if complex rendering is needed.
    // For now, renderHTML is sufficient.
    return ({ node, getPos, editor }) => {
      const { readonly } = this.options; // 从 options 中获取当前状态
      console.log(readonly);

      const wrapper = document.createElement('span');
      wrapper.classList.add('tag-wrapper');

      const dom = document.createElement('span');

      // Get attributes directly from the node being rendered
      const { label, ...attrs } = node.attrs as TagAttributes;

      // Set data attributes
      Object.entries(attrs).forEach(([key, value]) => {
        if (value !== null) {
          dom.setAttribute(`data-${key}`, value);
        }
      });

      dom.setAttribute('data-type', 'tag');
      dom.classList.add('tag'); // Add a class for styling
      if (!readonly) {
        dom.addEventListener('click', () => {
          this.options.onTagClick(node.attrs as TagAttributes, getPos());
        });
      }

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label; // Set the visible text
      dom.appendChild(labelSpan);

      if (!readonly) {
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = closeSVG;
        closeButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const pos = getPos();
          editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
          editor.view.focus();
        });
        dom.appendChild(closeButton);
      }

      wrapper.appendChild(dom);

      return {
        dom: wrapper,
        update: (updatedNode) => {
          debugger;
          return true;
        },
      };
    };
  },
});
