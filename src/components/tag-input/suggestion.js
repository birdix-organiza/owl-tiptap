import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';

export const SuggestionPlugin = Extension.create({
  name: 'suggestionPlugin',

  addOptions() {
    return {
      char: '#',
      allowedPrefixes: null, // Default Tiptap behavior
      items: () => [],
      command: () => {},
      render: () => ({}),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options,
      }),
    ];
  },
});
