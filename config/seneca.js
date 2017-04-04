module.exports = function() {
  var seneca = require('seneca')()
    .client({
      pin: "role: robStatus",
      host: process.env.HOST_IP,
      port: 10102
    })
    .client({
      pin: "role: DEsoftware",
      host: process.env.HOST_IP,
      port: 10103
    })
    .client({
      pin: "role: skidCounter",
      host: process.env.HOST_IP,
      port: 10104
    })

  return seneca
}
