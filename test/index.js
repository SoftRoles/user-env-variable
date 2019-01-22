var assert = require('assert')
var userEnvVariable = require("..")

userEnvVariable.list(function(err, result){
  assert.equal(err,null)
  console.log(result)
})

userEnvVariable.get('SOFTROLES_SERVICE_FILESYSTEM_PORT', function(err, result){
  assert.equal(err,null)
  console.log(result)
})

userEnvVariable.set('SOFTROLES_SERVICE_FILESYSTEM_PORT', 3004, function(err){
  assert.equal(err,null)
})