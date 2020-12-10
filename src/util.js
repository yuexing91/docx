import _ from 'lodash';

export function parseXML(xml) {
  const fragment = document.createDocumentFragment();

  const div = fragment.appendChild(document.createElement('div'));

  div.innerHTML = xml.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi, '<$1></$2>');

  return div.childNodes;
}

export function xmlStrToJSON(xml) {
  const root = _.find(parseXML(xml),t=>{
    return t.nodeType === 1;
  });
  return xmlToJSON(root);
}

export function xmlToJSON(el) {
  const node = {
    id:_.uniqueId('docx_'),
    name: el.nodeName.toLowerCase(),
  };

  if (el.firstChild && el.firstChild.nodeName == '#text') {
    node.textContent = el.firstChild.textContent;
  }

  if (el.attributes && el.attributes.length > 0) {
    node.attributes = {};
    _.each(el.attributes, attr => {
      node.attributes[attr.name] = attr.value;
    });
  }


  const children = _.map(el.children, child => {
    return xmlToJSON(child);
  });



  if (children.length > 0) {
    node.children = children;
  }

  return node;
}

export function _findChindOption(option, name) {
  return _.find(option.children, { name });
}

export function findChindOption(option, path) {
  for(const p of path.split('/')) {
    option = _findChindOption(option, p);
  }
  return option;
}

