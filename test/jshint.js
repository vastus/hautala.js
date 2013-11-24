'use strict';

var assert = require('assert')
  , jshint = require('jshint').JSHINT
  , fs = require('fs')
  , cjson = require('cjson')
  , util = require('util');

// Map, filter undefined and join into a string.
function mapFilterJoin(a, f) {
  return a.map(f).filter(function (s) { return !!s; }).join('\n');
}

// Returns a formatter function that formats hints for a specific file.
function hintFormatter(file) {
  return function (i) {
    if (!i) { return; }
    return util.format('%s on line %d:%d - %s', file, i.line, i.character, i.reason);
  };
}

function hint(folder) {
  var files = fs.readdirSync('./' + folder).filter(function (file) {
    // Only keep .js files.
    return file.match(/^.+\.js$/);
  });

  var errors = mapFilterJoin(files, function (file) {

    // Run JSHint.
    jshint(fs.readFileSync(folder + '/' + file, 'utf8'),
      cjson.load(__dirname + '/jshint-options.json'),
      {'describe': false, 'it': false});

    // Read errors.
    var e = jshint.data().errors || [];

    // Map them with a formatter function.
    return mapFilterJoin(e, hintFormatter(file));
  });

  return errors;
}

describe('Code quality', function () {
  it('Conforms to JSHint', function () {
    assert.equal(mapFilterJoin(
      ['lib',
      '1-tyyppiturvallisuus',
      '2-typesAndConventions',
      '3-oliotJaPeriytyminen',
      'test',
      'test/type',
      'test/functional'], hint), '');
  });
});