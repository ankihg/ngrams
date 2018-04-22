const natural = require('natural');

const T = require('./init')
const generateNgram = require('../generate');
const run = require('../processRun');

//
//  filter the twitter public stream by the word 'mango'.
//

run({text: 'the century by the bombs fell'});

// _stream('arcade fire')


function _stream(track) {
    T.stream('statuses/filter', { track: track })
        .on('tweet', function (tweet) {
          console.log('\n\n' + track + '\n');
          console.log(tweet.text);
          generateNgram({text: tweet.text});
        })
}
