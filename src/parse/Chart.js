import Parse from './Parse';

class Pic extends Parse {
  parseToHTML() {
    const rid = this.attributes['r:id'];
    return `<div style="height: 100%;width: 100%;" docx-chart="${rid}"></div>`;
  }

  static docxName = 'c:chart';
}

Parse.reg(Pic);

export default Pic;
