import Parse from './Parse';

class P extends Parse {
  parseToHTML() {
    return `<p ${this.getStyle()}>${ this.parseChildren() || '&nbsp;' }</p>`;
  }

  static docxName = 'w:p';

  static htmlName = 'p';
}

Parse.reg(P);

export default P;
