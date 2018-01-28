const twitterAPI = require('node-twitter-api');
const CONFIG = require('./config');
const twitter = new twitterAPI({
    consumerKey: CONFIG.consumerKey,
    consumerSecret: CONFIG.consumerSecret,
    // callback: 'http://yoururl.tld/something'
});
