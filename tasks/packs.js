/*
 * grunt-packs
 * https://github.com/rhumlover/grunt-packs
 *
 * Copyright (c) 2014 Thomas Le Jeune
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('packs', 'An easy way to pack files from JSON config', function() {

    var options = this.options({
      separator: '\n'
    });

    this.files.forEach(function(f) {
      if (!f.dest) {
        f.dest = './';
      }
      else if (!/\/$/.test(f.dest)) {
        f.dest += '/';
      }

      var configFiles = f.orig.src,
        concat, fileExists, onEachFile;

      fileExists = function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      };

      concat = function(fileArray) {
        if (typeof fileArray.filter !== 'function') {
          grunt.log.warn('Each key must contains an array of filepath');
          return;
        }

        var _read, _join;

        _read = function(filepath) {
          return grunt.file.read(filepath)
        };
        _join = grunt.util.normalizelf(options.separator);

        return fileArray
          .filter(fileExists)
          .map(_read)
          .join(_join);
      };

      onEachFile = function(filepath) {
        var config = JSON.parse(grunt.file.read(filepath));

        Object.keys(config).forEach(function(key) {
          grunt.file.write((f.dest + key), concat(config[key]));
          grunt.log.writeln('File "' + key + '" created.');
        });
      };

      configFiles
        .filter(fileExists)
        .map(onEachFile);
    });
  });

};
