import Parse from './Parse';

class Run extends Parse {
  parseToHTML() {
    return `<span ${this.getStyle()}>${ this.parseChildren()}</span>`;
  }

  static docxName = 'w:r';
}

Parse.reg(Run);

export default Run;
