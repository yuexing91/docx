import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

import Docx from './Docx';

export function docx2HTML(docx) {

  if (typeof docx == 'string') {
    return new JSZip.external.Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(docx, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then(data => {
      return JSZip.loadAsync(data);
    }).then(docx => {
      return new Docx(docx).loadFile();
    });
  } else {
    return JSZip.loadAsync(docx).then(docx => {
      return new Docx(docx).loadFile();
    });
  }

}


