const CONFIG = require('./config')

const natural = require('natural')

const generateNgram = require('./generate');

const TWITTER_CHAR_MAX = 280;


module.exports = function(params) {

    if (params.text) {
        let ngrams = natural.NGrams.ngrams(params.text, CONFIG.WINDOWSIZE - 1, CONFIG.TOKENS.START, CONFIG.TOKENS.END);
        let outputs = ngrams.reduce((acc, ngram) => {
            let str = ngram.toString();
            let output = generateNgram({startsWith: str});
            if (output)
                acc[str] = output;
            return acc;
        }, {})

        if (CONFIG.TWEET || true)
            return Object.keys(outputs)
                    .filter((start) => outputs[start].length < TWITTER_CHAR_MAX)
                    .reduce((maxLengthStr, start) => outputs[start].length > maxLengthStr.length ? start.split(',').join(' ') + outputs[start] : maxLengthStr, '')

    }

}
