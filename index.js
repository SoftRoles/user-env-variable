/**
 * This module get and sets environment variables directly from registry 
 * on Windows.
 * 
 * Copyright(c) 2019 Hüseyin Yiğit
 * 
 * MIT Licensed
 *
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var regedit = require('regedit');
var findInFiles = require('find-in-files');
var replace = require('replace-in-file');
var fs = require('fs');
var os = require('os')
var path = require('path')

/**
 * Module exports.
 * @public
 */

module.exports.list = list
module.exports.get = get
module.exports.set = set

/**
 * List environment variables.
 * @param {Function} cb
 * @api public
 */
function list(cb) {
  if (process.platform == 'win2') {
    regedit.arch.list('HKCU\\Environment', function (err, result) {
      if (err) cb(err, null)
      else {
        cb(null, Object.keys(result['HKCU\\Environment'].values))
      }
    })
  }
  else {
    var bashrcPath = path.join(os.homedir(), '.bashrc')
    findInFiles.find('export', path.dirname(bashrcPath), '.bashrc$').then(function (results) {
      var variables = []
      if (results[bashrcPath]) {
        results[bashrcPath].line.forEach(function (item) {
          variables.push(item.replace('export ', '').split('=')[0])
        })
      }
      cb(null, variables)
    })
  }
}

/**
 * Get environment variable.
 * @param {String} key
 * @param {Function} cb
 * @api public
 */
function get(key, cb) {
  if (process.platform == 'win2') {
    regedit.arch.list('HKCU\\Environment', function (err, result) {
      if (err) cb(err, null)
      else {
        cb(null, result['HKCU\\Environment'].values[key])
      }
    })
  }
  else {
    let bashrcPath = path.join(os.homedir(), '.bashrc')
    findInFiles.find(key, path.dirname(bashrcPath), '.bashrc$').then(function (results) {
      if (results[bashrcPath]) {
        cb(null, results[bashrcPath].line[0].replace('export ', '').split('=')[1])
      }
      else cb(null, null)
    })
  }
}

/**
 * Set environment variable.
 * @param {String} key
 * @param {String} value
 * @param {Function} cb
 * @api public
 */
function set(key, value, cb) {
  if (process.platform == 'win2') {
    regedit.putValue({
      'HKCU\\Environment': {
        [key]: {
          value: String(value),
          type: 'REG_EXPAND_SZ'
        }
      }
    }, function (err) {
      cb(err)
    })
  }
  else{
    let bashrcPath = path.join(os.homedir(), '.bashrc')
    findInFiles.find(key, path.dirname(bashrcPath), '.bashrc$').then(function (results) {
      if (results[bashrcPath]) {
        const options = {
          files: bashrcPath,
          from: results[bashrcPath].line[0],
          to: 'export ' + key + '=' + String(value),
        };
        replace(options, (err, changes) => {
          if (err) cb(err)
          else cb(null)
        });
      }
      else{
        fs.appendFile(bashrcPath, 'export ' + key + '=' + String(value), function (err) {
          if (err) cb(err)
          else cb(null)
        });
      } 
    })
  }
}