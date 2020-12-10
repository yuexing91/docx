import Parse from './Parse';

class Td extends Parse {
  parseToHTML() {
    const pr = this.getPr();
    let s    = '';
    if (pr) {
      const gridSpan = pr.findChild('w:gridspan');
      if (gridSpan && gridSpan.attributes) {
        const colspan = gridSpan.attributes['w:val'];
        if (colspan > 1) {
          s += ` colspan="${colspan}"`;
        }
      }

      const rowSpan = pr.findChild('w:vmerge');
      if (rowSpan && rowSpan.attributes && rowSpan.attributes['w:val'] == 'restart') {

      }
    }

    return `<td ${s} ${this.getStyle()}>${ this.parseChildren()}</td>`;
  }

  static docxName = 'w:tc';

  static htmlName = 'td';

}

Parse.reg(Td);

export default Td;
