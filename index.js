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
    findInFiles.find('export', os.homedir(), '.bashrc$').then(function (results) {
      var variables = []
      console.log(results)
      if (results['.bashrc']) {
        results['.bashrc'].line.forEach(function(item){
          variables.push(item.replace('export ', '').split(' = ')[0])
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
  regedit.arch.list('HKCU\\Environment', function (err, result) {
    if (err) cb(err, null)
    else {
      cb(null, result['HKCU\\Environment'].values[key])
    }
  })
}

/**
 * Set environment variable.
 * @param {String} key
 * @param {String} value
 * @param {Function} cb
 * @api public
 */
function set(key, value, cb) {
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