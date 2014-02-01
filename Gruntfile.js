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

  grunt.registerTask('stopwordsToJson', function() {
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
    fs.writeFileSync("lang-all.json", JSON.stringify(stopwords), 'utf-8', {flags: 'w+'});
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('default', ['stopwordsToJson']);
};
