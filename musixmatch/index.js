const CONFIG = require('./config');
const music = require('musicmatch')({usertoken:CONFIG.TOKEN, format:"", appid: CONFIG.APP_ID});

music.track({track_id:15445219})
.then(function(data){
        console.log(data);
}).catch(function(err){
        console.log(err);
})
