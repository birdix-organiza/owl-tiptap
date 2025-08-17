import { Node, mergeAttributes } from '@tiptap/core';

export const TagNode = Node.create({
  name: 'tag',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

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
    return ({ node }) => {
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
      dom.textContent = label; // Set the visible text

      return {
        dom,
      };
    };
  },
});
