module.exports = {
  id: 'must-exist-title',
  description: 'title tag must exist header',
  init: function(parser, reporter){
    var self = this;
    var isFound = false;

    function onSearchStartTitle(event){
      if(event.tagName.toLowerCase() === 'head'){
        parser.addListener('tagstart', onTagStartInnerHead);
        parser.addListener('tagend', onTagEndHead);
      }
    }

    function onTagStartInnerHead(event){
      if(event.tagName.toLowerCase() === 'title'){
        isFound = true;
      }
    }

    function onTagEndHead(event){
      if(!isFound){
        reporter.warn('title tag not exist in head tags', event.line, event.col, self, event.raw);
      }
      parser.removeListener('tagstart', onTagStartInnerHead);
      parser.removeListener('tagstart', onSearchStartTitle);
      parser.removeListener('tagend', onTagEndHead);
    }

    parser.addListener('tagstart', onSearchStartTitle);
  }
};