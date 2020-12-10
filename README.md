# Docx-js

> 纯js实现的docx文件预览  [在线地址](https://yuexing91.github.io/docx-js/index.html)


## Usage

```js

import Docx from 'docx-js'

Docx.docx2HTML(evt.target.files[0]).then(docx => {
  docx.toHTML(document.getElementById('app'))
});
```
