import _ from 'lodash';
const Parses = {};

class Parse {
  constructor(option, docx) {
    Object.assign(this, option);
    this.option = option;
    this.docx   = docx;

    this.children = _.map(option.children, child => {
      return Parse.getParse(child, docx);
    });

  }

  types() {
    return 'ELEMENT';
  }

  parseToHTML() {
    return this.children.map(child => {
      return child.parseToHTML();
    }).join('');
  }

  parseChildren(name) {
    return _.map(name ? _.filter(this.children, { name }) : this.children, child => child.parseToHTML()).join('');
  }

  getPr() {
    return _.find(this.children, child => {
      return child.types() == 'STYLE';
    });
  }

  findChild(path) {
    const _find = (child, name) => {
      return _.find(child.children, { name });
    };
    let parse   = this;
    for(const p of path.split('/')) {
      parse = _find(parse, p);
    }
    return parse;
  }

  getStyle() {
    const pr = this.getPr();
    let s    = '';
    if (pr) {
      s = pr.getStyle().join('');
    }
    return s ? `style="${s}"` : '';
  }

  pointToPT(name) {
    name = name || 'w:val';
    return `${this.attributes[name] / 20}pt`;
  }

  static reg(_Parse) {
    if (Array.isArray(_Parse.docxName)) {
      _.each(_Parse.docxName, name => {
        Parses[name] = _Parse;
      });
    } else {
      Parses[_Parse.docxName] = _Parse;
    }
  }

  static getParse(item, docx) {
    const _Parse = Parses[item.name] || Parse;
    return new _Parse(item, docx);
  }

  static htmlName = 'div';

}

export default Parse;
