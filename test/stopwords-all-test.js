var test = require('tape');

var typeString = function(obj) {
  return Object.prototype.toString.call(obj);
};

test('stopwords-all.json can be required and contains English', function(t) {
  try {
    var stopwords = require('../stopwords-all');
    t.equal(typeString(stopwords), '[object Object]');
    t.equal(typeString(stopwords['en']), '[object Array]');
    t.ok(stopwords['en'].length > 0);
  } catch(e) {
    t.fail('Could not require stopwords-all.json');
  }
  t.end();
})
