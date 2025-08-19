import { Node, mergeAttributes } from '@tiptap/core';

const closeSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

export const TagNode = Node.create({
  name: 'tag',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions() {
    return {
      onTagClick: () => {},
    };
  },

  addAttributes() {
    return {
      value: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-value'),
        renderHTML: (attributes) => ({ 'data-value': attributes.value }),
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => ({ 'data-label': attributes.label }),
      },
      group: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-group'),
        renderHTML: (attributes) => ({ 'data-group': attributes.group }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="tag"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-type': 'tag' }, HTMLAttributes),
      this.options.renderLabel ? this.options.renderLabel(HTMLAttributes) : HTMLAttributes.label,
    ];
  },

  renderText({ node }) {
    return node.attrs.label;
  },

  addNodeView() {
    // We can implement an Owl NodeView here later if complex rendering is needed.
    // For now, renderHTML is sufficient.
    return ({ node, getPos, editor }) => {
      const wrapper = document.createElement('span');
      wrapper.classList.add('tag-wrapper');

      const dom = document.createElement('span');

      // Get attributes directly from the node being rendered
      const { label, ...attrs } = node.attrs;

      // Set data attributes
      Object.entries(attrs).forEach(([key, value]) => {
        if (value !== null) {
          dom.setAttribute(`data-${key}`, value);
        }
      });

      dom.setAttribute('data-type', 'tag');
      dom.classList.add('tag'); // Add a class for styling
      dom.addEventListener('click', () => {
        this.options.onTagClick(node.attrs, getPos());
      });

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label; // Set the visible text
      dom.appendChild(labelSpan);

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

      wrapper.appendChild(dom);

      return {
        dom: wrapper,
      };
    };
  },
});
