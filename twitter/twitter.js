const async = require('async');
const twitterAPI = require('node-twitter-api');
const CONFIG = require('../config');
const twitter = new twitterAPI({
    consumerKey: CONFIG.consumerKey,
    consumerSecret: CONFIG.consumerSecret,
    // callback: 'http://yoururl.tld/something'
});

const SESH = {};
return async.series([
        (next) => {
            twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
            	if (error) {
            		console.log("Error getting OAuth request token : " + error);
            	} else {
            		//store token and tokenSecret somewhere, you'll need them later; redirect user
                    console.log(requestToken);
                    SESH.req = {
                        token: requestToken,
                        tokenSecret: requestTokenSecret
                    };
                    console.log(SESH.req);
                    return next();
            	}
            });
        },
        // (next) => {
        //     console.log(SESH.req);
        //     twitter.getAccessToken(SESH.req.token, SESH.req.tokenSecret, null, function(error, accessToken, accessTokenSecret, results) {
        //     	if (error) {
        //     		console.log(error);
        //     	} else {
        //             console.log('at', accessToken);
        //     		//store accessToken and accessTokenSecret somewhere (associated to the user)
        //     		//Step 4: Verify Credentials belongs here
        //     	}
        //     });
        // }
    ], (err) => {
        if (err) console.log('err', err);
    }
);
