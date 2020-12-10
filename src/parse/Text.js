import _ from 'lodash';
import Parse from './Parse';

class Text extends Parse {
  parseToHTML() {
    const text = _.get(this.option, 'textContent', '');
    return `<t>${text}</t>`;
  }

  static docxName = 'w:t';
}

Parse.reg(Text);

export default Text;
