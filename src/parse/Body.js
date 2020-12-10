import Parse from './Parse';

const style = `<style>
  .docx-root{
    background: #fff;
    box-shadow: 2px 1px 20px #ccc;
    border:1px solid #ccc;
    margin:0px auto;
    word-break: break-all;
  }
  
  .docx-root p{
      font-family: eastAsia, sans-serif;
      font-size: 10.5pt;
      text-align: justify;
      display: block;
      list-style-type: none;
      padding: 0;
      margin: 0;
      line-height: 1.44;
  }
  .docx-root p span{
    display: inline;
    white-space: pre-wrap;
  }
  .docx-root .hyperlink{
    display: block;
    text-decoration: none;
    color: inherit;
    text-align: left;
  }
  .docx-root .hyperlink span:nth-last-child(2){
    float: right;
  }
</style>`;

class Body extends Parse {
  parseToHTML() {
    return `${this.getClass()}<div class="docx-root" ${this.getStyle()}>
        <div ${this.getContentStyle()}>
          ${ this.parseChildren()}
        </div>
      </div>`;
  }

  getClass() {
    return style;
  }

  getContentStyle() {
    const pageMargin = this.findChild('w:sectpr/w:pgmar');
    return `style="margin:0pt ${pageMargin.pointToPT('w:right')} 0pt ${pageMargin.pointToPT('w:left')}"`;
  }

  static docxName = 'w:body';

  static htmlName = 'div';

}

Parse.reg(Body);

export default Body;
