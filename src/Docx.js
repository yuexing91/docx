import _ from 'lodash';
import { xmlToJSON } from './util';

import Parse from './parse/Parse';
import './parse/BookmarkStart';
import './parse/Hyperlink';
import './parse/Style';
import './parse/Body';
import './parse/P';
import './parse/Drawing';
import './parse/Run';
import './parse/Text';
import './parse/Table';
import './parse/Td';
import './parse/Tr';
import './parse/Pic';
import './parse/Chart';

import Chart from './chart/Chart';
/***
 * fafe
 */
class Docx {
  //1123
  constructor(docx) {
    this.docx = docx;
  }

  loadFile() {
    const files    = {};
    const loadFile = (file) => {
      return this.docx.file(file).async('string').then(data => {
        files[file] = xmlToJSON(( new window.DOMParser() ).parseFromString(data, 'text/xml'));
      });
    };

    this.files = files;

    return Promise.all([
      loadFile('word/styles.xml'),
      loadFile('word/_rels/document.xml.rels'),
      loadFile('word/document.xml'),
    ]).then(() => {
      this.document = Parse.getParse(files['word/document.xml'], this);
      return this;
    });
  }

  toHTML(el) {
    el.innerHTML = this.document.parseToHTML();
    return this.loadObject(el);
  }

  loadObject(el) {
    const imgs = _.map(el.querySelectorAll('img[docx-pic]'), img => {
      const rid = img.getAttribute('docx-pic');
      return this.getImage(rid).then(data => {
        img.setAttribute('src', data);
      });
    });

    const charts = _.map(el.querySelectorAll('div[docx-chart]'), chart => {
      const rid = chart.getAttribute('docx-chart');
      return this.getChart(rid).then(data => {
        this.initChart(chart, data);
      });
    });

    return Promise.all(imgs.concat(charts));
  }

  getStyle(id) {
    const style = _.find(this.files['word/styles.xml'].children[0].children, child => {
      return (child.name == 'w:style' && child.attributes['w:styleId'] === id);
    });

    const t = Parse.getParse(style);

    return _.flatMap(_.filter(t.children, c => {
      return c.types() == 'STYLE';
    }), c => {
      return c._getStyle();
    });
  }

  getImage(relId) {
    const node = this.getRel(relId);
    const img  = node.attributes.Target;

    return this.docx.file(`word/${img}`).async('blob').then(data => {
      return URL.createObjectURL(data);
    });
  }

  getChart(relId) {
    const node  = this.getRel(relId);
    const chart = node.attributes.Target;

    return this.docx.file(`word/${chart}`).async('string').then(data => {
      return ( new window.DOMParser() ).parseFromString(data, 'text/xml');
    });
  }


  getRel(relId) {
    return _.find(this.files['word/_rels/document.xml.rels'].children[0].children, item => {
      return item.attributes.Id == relId;
    });
  }

  initChart(el, option) {
    try{
      Chart.parse(el, option);
    }catch (e){
      console.error(e)
    }

  }

}

export default Docx;
