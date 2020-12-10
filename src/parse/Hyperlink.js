import Parse from './Parse';

class Hyperlink extends Parse {
  parseToHTML() {
    return `<a href="#${this.attributes['w:anchor']}" docx-name="hyperlink" class="hyperlink">${ this.parseChildren() }</a>`;
  }

  static docxName = 'w:hyperlink';
}

Parse.reg(Hyperlink);

export default Hyperlink;
