const CONFIG = require('./config');

const generate = require('./generate');
const run = require('./processRun');
const stream = require('./twitter/stream')
const twitter = require('./twitter');


if (CONFIG.STREAM)
    return stream(CONFIG.STREAM, (err, event) => {
        console.log('event', event);
        let output =  run(event);
        if (output)
            _tweet(output);
    });
else
    return generate({ startsWith: CONFIG.RUN.STARTS_WITH });


function _tweet(cleanOutput) {
    if (CONFIG.TWEET) twitter.post(cleanOutput);
}
