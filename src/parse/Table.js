import _ from 'lodash';
import Parse from './Parse';
import { findChindOption } from '../util';

class Table extends Parse {
  parseToHTML() {
    return `<table id="${this.option.id}">
    ${this.getStyle()}
    ${this.getColgroup()}
    ${this.parseChildren('w:tr')}
    </table>`;
  }

  getStyle() {
    const prObj = this.getPr();
    let type    = 'solid';
    let color   = '000';
    let w = ''
    try {

      const tblW = prObj.findChild('w:tblw');
//      if(tblW){
//        w = `width:${tblW.attributes['w:w']/10}pt;`
//      }

      const top = prObj.findChild('w:tblborders/w:top');
      type      = top.attributes['w:val'];
      color     = top.attributes['w:color'];
      if (type == 'single') {
        type = 'solid';
      }
      if (color == 'auto') {
        color = '000';
      }
    } catch (e) {

    }

    return `<style>
    #${this.option.id},#${this.option.id} td{
      vertical-align: top;
      border-collapse: collapse;
      border: 1px ${type} #${color};
      ${w}
    }
    #${this.option.id} p{
      margin:auto;
    }
    </style>`;

  }

  getColgroup() {
    const colgroup = findChindOption(this.option, `w:tblgrid`);

    const cols = _.map(colgroup.children, col => {
      const pt = `${col.attributes['w:w'] / 20}pt`;
      return `<col style="width: ${pt};min-width: ${pt};max-width: ${pt};"></col>`;
    }).join('');

    return `<colgroup>${cols}</colgroup>`;

  }

  static docxName = 'w:tbl';
}

Parse.reg(Table);

export default Table;
