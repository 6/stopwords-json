var fs = require('fs'),
    glob = require('glob'),
    _ = require('underscore');

module.exports = function(grunt) {
  var wordsInFile = function(file) {
    var words = [];
    var lines = file.split(/[\n\r]+/);
    _.each(lines, function(line) {
      line = line.trim();
      if (line === "" || line[0] === "#") {
        return;
      }
      words.push(line);
    });
    return words;
  };

  var _stopwords = null; // Memoize method
  var getStopwords = function() {
    if (_stopwords) return _stopwords;
    var stopwords = {};
    _.each(glob.sync('src/**/*.txt'), function(filename) {
      var file = grunt.file.read(filename),
          language = filename.match(/([a-z]{2})\.txt$/)[1];
      stopwords[language] = stopwords[language] || [];
      _.each(wordsInFile(file), function(word) {
        if (stopwords[language].indexOf(word) === -1) {
          stopwords[language].push(word);
        }
      });
    });
    for(var language in stopwords) {
      stopwords[language] = stopwords[language].sort();
    }
    _stopwords = stopwords;
    return stopwords;
  };

  grunt.registerTask('stopwordsToJson', function() {
    var stopwords = getStopwords();
    for(var language in stopwords) {
      fs.writeFileSync("dist/"+language+".json", JSON.stringify(stopwords[language]), 'utf-8', {flags: 'w+'});
    }
    fs.writeFileSync("stopwords-all.json", JSON.stringify(stopwords), 'utf-8', {flags: 'w+'});
  });

  grunt.registerTask('stopwordsDocs', function() {
    var stopwords = getStopwords();
    var languages = Object.keys(stopwords);

    var table = "There are a total of "+languages.length+" supported languages:\n\n";
    table += "ISO 639-1 code | Stopword count\n";
    table += "--- | ---\n";
    for (var language in stopwords) {
      var wordCount = stopwords[language].length;
      table += [language, wordCount].join(" | ") + "\n";
    }
    fs.writeFileSync("docs/supported-languages.md", table, 'utf-8', {flags: 'w+'});
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    readme: {
      options: {
        alt: {
          src: ['docs/README.tmpl.md'],
          dest: './'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-readme');

  grunt.registerTask('default', ['stopwordsToJson', 'stopwordsDocs', 'readme']);
};
