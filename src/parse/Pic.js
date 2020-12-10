import Parse from './Parse';

class Pic extends Parse {
  parseToHTML() {
    const rid = this.findChild('pic:blipfill/a:blip').attributes['r:embed'];
    return `<img width="100%" height="100%" docx-pic="${rid}" alt="不支持的图片类型">`;
  }

  static docxName = 'pic:pic';
}

Parse.reg(Pic);

export default Pic;
