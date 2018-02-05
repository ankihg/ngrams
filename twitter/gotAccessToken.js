const async = require('async');
const twitterAPI = require('node-twitter-api');
const CONFIG = require('../config');
const SESH = CONFIG.SESH;
const twitter = new twitterAPI({
    consumerKey: CONFIG.consumerKey,
    consumerSecret: CONFIG.consumerSecret,
    // callback: 'http://yoururl.tld/something'
});

return async.series([
        // (next) => {
        //     console.log(SESH.SESH);
        //     twitter.getAccessToken(SESH.req.token, SESH.req.tokenSecret, SESH.req.oauthVerifier, function(error, accessToken, accessTokenSecret, results) {
        //     	if (error) {
        //     		console.log(error);
        //     	} else {
        //             console.log('accessToken', accessToken);
        //             console.log('accessTokenSecret', accessTokenSecret);
        //     		//store accessToken and accessTokenSecret somewhere (associated to the user)
        //     		//Step 4: Verify Credentials belongs here
        //             SESH.access = {
        //                 token: accessToken,
        //                 tokenSecret: accessTokenSecret,
        //             };
        //             console.log('access', SESH.access);
        //             return next();
        //     	}
        //     });
        // },
        (next) => {
            twitter.getTimeline('home',
                {},
            	SESH.access.token,
            	SESH.access.tokenSecret,
            	function(error, data, response) {
            		if (error) {
            			// something went wrong
                        console.log('er', error);
            		} else {
            			// data contains the data sent by twitter
                        console.log('got data', data.length);
                        console.log(data.map(d => { return { text: d.text, user: d.user.name } }));
            		}
                    return next();
            	}
            );
        },
        (next) => {
            twitter.getTimeline('user',
                {user_id: '36511031'},
            	SESH.access.token,
            	SESH.access.tokenSecret,
            	function(error, data, response) {
            		if (error) {
            			// something went wrong
                        console.log('er', error);
            		} else {
            			// data contains the data sent by twitter
                        console.log('got data', data.length);
                        console.log(data.map(d => { return { text: d.text, user: d.user.name } }));
            		}
                    return next();
            	}
            );
        },
    ], (err) => {
        if (err) console.log('err', err);
    }
);
