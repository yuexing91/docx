import Parse from './Parse';

class BookmarkStart extends Parse {
  parseToHTML() {
    return `<a name="${this.attributes['w:name']}"></a>`;
  }

  static docxName = 'w:bookmarkstart';

  static htmlName = 'a';
}

Parse.reg(BookmarkStart);

export default BookmarkStart;
