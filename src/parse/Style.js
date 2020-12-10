import _ from 'lodash';
import Parse from './Parse';

class Style extends Parse {

  static docxName = ['w:ppr', 'w:rpr', 'w:trpr', 'w:tcpr', 'w:tblpr', 'w:sectpr'];

  types() {
    return 'STYLE';
  }

  getStyle() {
    return _.flatten(this._getStyle());
  }

  _getStyle() {
    return _.map(this.children, child => {
      const v = child.attributes ? child.attributes['w:val'] : '';
      if (child.name == 'w:jc') {
        return `text-align:${v};`;
      }
      if (child.name == 'w:ind') {
        return _.map(child.attributes, (v, k) => {
          if (k == 'w:right') {
            return `margin-right:${v / 20}pt;`
          }
          if (k == 'w:left') {
            return `margin-left:${v / 20}pt;`
          }
          if (k == 'w:firstLine') {
            return `text-indent:${v / 20}pt;`
          }
          return '';
        }).join('');

        return `text-indent:${child.pointToPT('w:firstLine')};`;
      }
      if (child.name == 'w:color') {
        return `color:${toColor(v)};`;
      }
      if (child.name == 'w:highlight') {
        return `background:${toColor(v)};`;
      }
      if (child.name == 'w:rfonts') {
        const family = _.uniq(_.map(child.attributes, v => {
          return v.split('_')[0];
        })).join(',');
        return `font-family:${family};`;
      }
      if (child.name == 'w:b') {
        if (v === '0') {
          return `font-weight:normal;`;
        }
        return `font-weight:bold;`;
      }
      if (child.name == 'w:sz') {
        return `font-size:${v / 2}pt;`;
      }
      if (child.name == 'w:trheight') {
        return `height:${child.pointToPT()};`;
      }
      if (child.name == 'w:valign' && v == 'center') {
        return `vertical-align: middle;`;
      }
      if (child.name == 'w:pgsz') {
        return `width: ${child.pointToPT('w:w')};`;
      }

      if (child.name == 'w:pstyle') {
        return this.docx.getStyle(v);
      }

      if (child.name == 'w:vmerge') {
        if (_.isEmpty(child.attributes) || v != 'restart') {
          return `border-top: none;`;
        } else {
          return `border-bottom: none;`;
        }
      }

      if (child.name == 'w:spacing') {
        const style    = {};
        let lineHeight = '';

        if (child.attributes['w:line']) {
          if (child.attributes['w:lineRule'] == 'exact' || child.attributes['w:lineRule'] == 'atLeast') {
            lineHeight = child.attributes['w:line'] / 20 + 'pt';
          } else {
            lineHeight = child.attributes['w:line'] / 240 * 1.44;
          }
          style['line-height'] = lineHeight;
        }

        _.each(child.attributes, (val, key) => {
          if (key == 'w:after') {
            style['margin-bottom'] = val / 20 + 'pt';
          }
          if (key == 'w:before') {
            style['margin-top'] = val / 20 + 'pt';
          }
        });

        return _.map(style, (v, k) => {
          return `${k}:${v};`;
        }).join('');

      }

      return '';
    });
  }

  parseToHTML() {
    return '';
  }
}

function toColor(color) {
  if (/^[\da-f]{3}([\da-f]{3})?$/i.test(color)) {
    return '#' + color;
  }

  if (color == 'green') {
    return '#00FF00';
  }
  if (color == 'darkYellow') {
    return '#808000';
  }
  return color;
}

Parse.reg(Style);

export default Style;
