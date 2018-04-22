const natural = require('natural');

const T = require('./init')
// const generateNgram = require('../generate');
// const run = require('../processRun');

//
//  filter the twitter public stream by the word 'mango'.
//

// let output = run({text: 'arcade fire played the best show of the century'});
// console.log(output);
// _stream('arcade fire')


module.exports = function _stream(track, callback) {
    T.stream('statuses/filter', { track: track })
        .on('tweet', function (tweet) {
          console.log('\n' + track.toUpperCase());
          console.log(tweet.text);
          callback(null, {text: tweet.text});
        })
}
