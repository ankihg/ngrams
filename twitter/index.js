const T = require('./init')

module.exports = {
    post(status) {
        T.post('statuses/update', { status: status }, function(err, data, response) {
            console.log(response, !!err, data)
        })
    }
}
