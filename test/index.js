
var userEnvVariable = require("../lib/index")

userEnvVariable.list(function(err, result){
  console.log(err == true)
  console.log(result)
})
userEnvVariable.get('SOFTROLES_SERVICE_FILESYSTEM_PORT', function(err, result){
  console.log(err == true)
  console.log(result)
})

userEnvVariable.set('SOFTROLES_SERVICE_FILESYSTEM_PORT', 3004, function(err){
  console.log(err)
})
