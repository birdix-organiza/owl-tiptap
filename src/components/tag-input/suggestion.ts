import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import { SuggestionItem } from './SuggestionList';
import { PluginKey } from 'prosemirror-state'; // optional, if you need to create a custom key
import { exitSuggestion } from '@tiptap/suggestion';

// 定义 SuggestionPlugin 选项的类型
interface SuggestionPluginOptions {
  char?: string;
  allowedPrefixes?: string[] | null;
  items?: (params: { query: string }) => SuggestionItem[];
  command?: (props: any) => void;
  render?: () => any;
}

export const MySuggestionPluginKey = new PluginKey('my-suggestions'); // or use the default 'suggestion'

export const exitSuggestionPlugin = (view: any) => {
  exitSuggestion(view, MySuggestionPluginKey);
};

export const SuggestionPlugin = Extension.create<SuggestionPluginOptions>({
  name: 'suggestionPlugin',

  addOptions(): SuggestionPluginOptions {
    return {
      allowedPrefixes: null, // Default Tiptap behavior
      command: () => {},
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: MySuggestionPluginKey,
        editor: this.editor,
        ...this.options,
      }),
    ];
  },
});
