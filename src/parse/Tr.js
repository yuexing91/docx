import Parse from './Parse';

class Tr extends Parse {
  parseToHTML() {
    return `<tr ${this.getStyle()}>${ this.parseChildren('w:tc')}</tr>`;
  }

  static docxName = 'w:tr';
}

Parse.reg(Tr);

export default Tr;
