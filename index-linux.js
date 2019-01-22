var findInFiles = require('find-in-files')
const replace = require('replace-in-file');
const fs = require('fs');

fs.appendFileSync('message.txt', 'data to append');

var variable = 'SOFTROLES_SERVICE_FILESYSTEM_PORT'
var value = '3004'
console.log(process.platform)

findInFiles.find('export', '.', '.bashrc$').then(function (results) {
  if (results['.bashrc']) {
    console.log(results)
    const options = {
      files: '.bashrc',
      from: results['.bashrc'].line[0],
      to: 'export ' + variable + ' = ' + String(value),
    };
    console.log(results['.bashrc'].line[0].replace('export ','').split(' = ')[1])
    replace(options, (error, changes) => {
      if (error) {
        return console.error('Error occurred:', error);
      }
      console.log('Modified files:', changes.join(', '));
      if (changes.length > 0) console.log(changes)
      else {
      }
    });
  }
  else {
    fs.appendFileSync('.bashrc', '\nexport ' + variable + ' = ' + String(value));
  }
})