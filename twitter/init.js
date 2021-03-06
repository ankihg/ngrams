const CONFIG = require('./config');
const Twit = require('twit')

module.exports = new Twit({
    consumer_key: CONFIG.consumerKey,
    consumer_secret: CONFIG.consumerSecret,
    access_token: CONFIG.SESH.access.token,
    access_token_secret: CONFIG.SESH.access.tokenSecret,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
})
