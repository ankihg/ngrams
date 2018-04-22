const generate = require('./generate');
const CONFIG = require('./config');

generate({ startsWith: CONFIG.RUN.STARTS_WITH });
