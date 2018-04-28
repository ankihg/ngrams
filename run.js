const CONFIG = require('./config');

const generate = require('./generate');
const run = require('./processRun');
const stream = require('./twitter/stream')
const twitter = require('./twitter');


if (CONFIG.STREAM)
    return stream(CONFIG.STREAM, (err, event) => {
        let output =  run(event);
        if (output) {
            console.log('\n\t####STREAM####');
            console.log(event.text);
            console.log('\n\t####TWEETING####');
            console.log(output);

            _tweet(output);
        }
    });
else {
    console.log(generate({ startsWith: CONFIG.RUN.STARTS_WITH }));
    return generate({ startsWith: CONFIG.RUN.STARTS_WITH });
}


function _tweet(content) {
    if (CONFIG.TWEET) twitter.post(content);
}
