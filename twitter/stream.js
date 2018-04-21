const T = require('./init')

//
//  filter the twitter public stream by the word 'mango'.
//


_stream('arcade fire')
// _stream('trump')


function _stream(track) {
    T.stream('statuses/filter', { track: track })
        .on('tweet', function (tweet) {
          console.log('\n\n' + track + '\n');
          console.log(tweet.text);
        })
}
