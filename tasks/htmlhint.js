/*
 * grunt-htmlhint
 * https://github.com/yaniswang/grunt-htmlhint
 *
 * Copyright (c) 2013 Yanis Wang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('htmlhint', 'Validate html files with htmlhint.', function() {

    var HTMLHint  = require("htmlhint").HTMLHint;
    var options = this.options({
        force: false
      }), 
      arrFilesSrc = this.filesSrc,
      verbose = grunt.verbose;

    if (options.htmlhintrc) {
      var rc = grunt.file.readJSON(options.htmlhintrc);
      grunt.util._.defaults(options, rc);
      delete options.htmlhintrc;
    }

    if (options.rulesAbsDir){
      var path = require('path');
      var fs = require('fs');
      var rulesAbsDir = options.rulesAbsDir;

      if(fs.statSync(rulesAbsDir).isDirectory()){
        fs.readdirSync(rulesAbsDir).forEach(function(file){
          if(path.extname(file) !== '.js'){ return; }
          var rule = path.join(path.relative(__dirname, options.rulesAbsDir), file);
          grunt.log.writeln('add custom-rule to: ' + rule);
          HTMLHint.addRule(require(rule));
        });
      }
    }

    var force = options.force;
    delete options.force;

    var hintCount = 0;
    arrFilesSrc.forEach(function( filepath ) {
      var file = grunt.file.read( filepath ),
        msg = "Linting " + filepath + "...",
        messages;
      if (file.length) {
        messages = HTMLHint.verify(file, options);
        verbose.write( msg );
        if (messages.length > 0) {
          verbose.or.write( msg );
          grunt.log.error();
        } else {
          verbose.ok();
        }
        messages.forEach(function( message ) {
          grunt.log.writeln( "[".red + ( "L" + message.line ).yellow + ":".red + ( "C" + message.col ).yellow + "]".red + ' ' + message.message.yellow );
          var evidence = message.evidence,
            col = message.col;
          if (col === 0) {
            evidence = '?'.inverse.red + evidence;
          } else if (col > evidence.length) {
            evidence = evidence + ' '.inverse.red;
          } else {
            evidence = evidence.slice(0, col - 1) + evidence[col - 1].inverse.red + evidence.slice(col);
          }
          grunt.log.writeln(evidence);
          hintCount ++;
        });
      }
      else{
        grunt.log.writeln( "Skipping empty file " + filepath);
      }
    });

    if ( hintCount > 0 ) {
      return force;
    }

    grunt.log.ok(arrFilesSrc.length + ' file' + (arrFilesSrc.length === 1 ? '' : 's') + ' lint free.');

  });

};
