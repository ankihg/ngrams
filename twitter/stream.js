const T = require('./init')
const generateNgram = require('../generate');

//
//  filter the twitter public stream by the word 'mango'.
//


_stream('arcade fire')


function _stream(track) {
    T.stream('statuses/filter', { track: track })
        .on('tweet', function (tweet) {
          console.log('\n\n' + track + '\n');
          console.log(tweet.text);
          generateNgram();
        })
}
