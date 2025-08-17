import { Component, mount, xml } from '@odoo/owl';
import { TagInput } from '../src';

class App extends Component {
  static components = {
    TagInput,
  };

  static template = xml`
<div style="width: 100%; height: 100%;">
  <TagInput/>
</div>
`;

  setup() {}
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
