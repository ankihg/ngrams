const CONFIG = require('./config');

const generate = require('./generate');
const run = require('./processRun');
const stream = require('./twitter/stream')


if (CONFIG.STREAM)
    return stream(CONFIG.STREAM, (err, event) => {
        return run(event);
    });
else
    return generate({ startsWith: CONFIG.RUN.STARTS_WITH });
