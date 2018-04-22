const natural = require('natural');
const fs = require('fs');
const twitter = require('./twitter');

const CONFIG = require('./config')

// const TRAINING_DATA_PATH = './datasets/djt.json';
const TRAINING_DATA_PATH = CONFIG.TRAININGDATA_FILEPATH || './datasets/arcade_fire.json';
const TWEET = CONFIG.TWEET || false;

const START = CONFIG.TOKENS.START;
const END = CONFIG.TOKENS.END;
const SPLIT = CONFIG.SPLIT_TOKEN || '<new>'; //'.'
// const SPLIT = '<new>' //'.'
const N = CONFIG.WINDOWSIZE || 3;
const OVERLAP_WINDOW = CONFIG.OVERLAP_WINDOWSIZE || 2;

var START_MATCH = [];
var END_MATCH = [];
for (var i = 0; i < OVERLAP_WINDOW; i++) {
    START_MATCH.push(START);
    END_MATCH.push(END);
}
START_MATCH = START_MATCH.toString();
END_MATCH = END_MATCH.toString();

module.exports = function(params) {
    let ngramsByStart;
    try {
        if (CONFIG.USE_TRAINED)
            ngramsByStart = require('./probs');
    } catch(e) {}

    if (ngramsByStart)
        return _exec(null, ngramsByStart);
    return _train(ngramsByStart, _exec);


        function _exec(err, ngramsByStart) {
            let cleanOutput = generate(params, ngramsByStart);
            console.log(cleanOutput);
            _tweet(cleanOutput);
            return cleanOutput;
        }

        function generate(params, ngramsByStart) {
            var outupt = _generate(ngramsByStart, '', params.startsWith);
            // console.log(outupt);
            var cleanOutput = _cleanOutput(outupt);
            return cleanOutput;

            function _generate(_ngramsByStart, phrase='', start=START_MATCH) {
                // phrase = phrase || '';
                // start = start || START;
                if (start === END_MATCH) return phrase;

                var possibleNGrams = _ngramsByStart[start];
                if (!possibleNGrams) {
                    console.log('[NOTICE] no ngram matches for start ' + start);
                    return _generate(_ngramsByStart, phrase, END_MATCH);
                }
                var nextNgramIndex = _selectNextNgram('probability')
                var ngram = possibleNGrams[nextNgramIndex].ngram;
                phrase += ' ' + ngram.slice(OVERLAP_WINDOW).join(' ');
                return _generate(_ngramsByStart, phrase, ngram.slice(ngram.length - OVERLAP_WINDOW).toString());

                function _selectNextNgram(method) {
                    if (method === 'probability') {
                        let reduced = possibleNGrams.reduce((acc, ngram, index) => {
                            acc.ngramIndexByRange[acc.sum] = index;
                            acc.sum += ngram.prob;
                            return acc;
                        }, {
                            ngramIndexByRange: {},
                            sum: 0,
                        })

                        let random = Math.random() * reduced.sum;

                        let ranges = Object.keys(reduced.ngramIndexByRange);
                        for (let i = 0; i < ranges.length; i++) {
                            if (random >= ranges[i] && (ranges[i + 1] ? random < ranges[i + 1] : true))
                                return reduced.ngramIndexByRange[ranges[i]]
                        }
                    }
                    console.log('[NOTICE] randomly selecting next ngram');
                    return Math.floor(Math.random() * possibleNGrams.length);
                }
            }
        }

        function _tweet(cleanOutput) {
            if (TWEET) twitter.post(cleanOutput);
        }
}

function _train(ngramsByStart, next) {
    if (ngramsByStart) return next(null, ngramsByStart);

    fs.readFile(TRAINING_DATA_PATH, (err, contents) => {

        if (TRAINING_DATA_PATH === './datasets/arcade_fire.json')
            contents = JSON.stringify(JSON.parse(contents)
                            .filter((el) => el.collection !== 'other songs:').map((el) => el.text));
        else if (TRAINING_DATA_PATH === './datasets/djt.json')
            contents = JSON.stringify(JSON.parse(contents).slice(0, 1000));

        contents = contents.toString().toLowerCase().replace(/\.\s/g, ' ' + START + ' ' + END + ' ')

        var phrases;
        if (TRAINING_DATA_PATH.split('.').pop() === 'json')
            phrases = JSON.parse(contents.toString());
        else
            phrases = contents.toString().toLowerCase().split(new RegExp(SPLIT)) //.split(/\.\s/);

        console.log(phrases.length);
        // console.log(phrases);
        console.log('0');
        let grams = phrases/*.slice(0, 10000)*/.reduce((acc, phrase) => {
            console.log(phrase);
            acc.nm1grams = acc.nm1grams.concat(natural.NGrams.ngrams(phrase, N - 1, START, END));
            acc.ngrams = acc.ngrams.concat(natural.NGrams.ngrams(phrase, N, START, END));
            return acc;
        }, {
            nm1grams: [],
            ngrams: [],
        });
        console.log('1');
        var nm1gramCounts = grams.nm1grams
            .reduce((hash, ngram) => {
                hash[ngram.toString()] = hash[ngram.toString()] || 0;
                hash[ngram.toString()]++;
                return hash;
            }, {});

        console.log('2');
        var ngramCounts = grams.ngrams
            .reduce((hash, gram) => {
                hash[gram.toString()] = hash[gram.toString()] || 0;
                hash[gram.toString()]++;
                return hash;
            }, {});

        console.log('3');
        var ngramProbs = Object.keys(ngramCounts).reduce((hash, ngramKey) => {
            var ngram = ngramKey.split(',');
            var nm1gram = ngram.slice(0, ngram.length - 1);
            hash[ngram.toString()] = ngramCounts[ngram.toString()] / (nm1gramCounts[nm1gram.toString()] || 1);
            // console.log(hash[ngram.toString()], ngramKey, ngramCounts[ngram.toString()], nm1gram.toString(), nm1gramCounts[nm1gram.toString()]);
            // if (!(ngramCounts[ngram.toString()] / nm1gramCounts[nm1gram.toString()]))
            //     console.log(ngramKey, nm1gramCounts[nm1gram.toString()]);
            return hash;
        }, {});

        console.log('4');
        ngramsByStart = Object.keys(ngramCounts).reduce((hash, ngramKey) => {
            var ngram = ngramKey.split(',');
            var matchKey = ngram.slice(0, OVERLAP_WINDOW).toString();
            hash[matchKey] = hash[matchKey] || [];
            hash[matchKey].push({prob: ngramProbs[ngramKey], ngram: ngram});
            return hash;
        }, {});
        // console.log('ngramsByStart', JSON.stringify(ngramsByStart, null, 4));
        // console.log(ngramsByStart);
        fs.writeFile('./probs.json', JSON.stringify(ngramsByStart, null, 4), (err) => { err && console.log(err);})
        console.log('5');
        return next(null, ngramsByStart);
    });

}

function _cleanOutput(str) {
    return str
        .replace(/ 000 /g, '\n ').replace(/ 000 /g, '\n ')
        .replace(/ m /g, '\'m ').replace(/ s /g, '\'s ').replace(/ t /g, '\'t ')
        .replace(/ ve /g, '\'ve ').replace(/ re /g, '\'re ').replace(/ ll /g, '\'ll ')
        .replace(new RegExp(START, 'g'), '')
        .replace(new RegExp(END, 'g'), '');
}
