import Parse from './Parse';

class Drawing extends Parse {
  parseToHTML() {
    const child = _.first(this.children);

    const cls = child.name == 'wp:inline' ? 'wp-inline' : 'wp-floating';

    if (child.name == 'wp:inline') {

    }

    const extent = child.findChild('wp:extent');

    let cx = extent.attributes['cx'] / 12700 + 'pt';
    let cy = extent.attributes['cy'] / 12700 + 'pt';

    return `<div class="${cls}" style="width: ${cx};height:${cy};margin: 0px auto;">${this.parseChildren()}</div>`;
  }

  static docxName = 'w:drawing';

}

Parse.reg(Drawing);

export default Drawing;
