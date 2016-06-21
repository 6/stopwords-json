var test = require('tape');

test('stopwords-all.json can be required and contains English', function(t) {
  try {
    var stopwords = require('../stopwords-all');
    t.ok(stopwords);
    t.ok(stopwords['en']);
  } catch(e) {
    t.fail('Could not require stopwords-all.json');
  }
  t.end();
})
