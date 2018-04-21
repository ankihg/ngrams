const natural = require('natural');
const fs = require('fs');
const twitter = require('./twitter');

const TRAINING_DATA_PATH = './datasets/djt.json';
// const TRAINING_DATA_PATH = './datasets/arcade_fire.json';
const TWEET = false;

const START = '<start>';
const END = '<end>';
const SPLIT = '<new>' //'.'
// const SPLIT = '<new>' //'.'
const N = 3;
const OVERLAP_WINDOW = 2;

var START_MATCH = [];
var END_MATCH = [];
for (var i = 0; i < OVERLAP_WINDOW; i++) {
    START_MATCH.push(START);
    END_MATCH.push(END);
}
START_MATCH = START_MATCH.toString();
END_MATCH = END_MATCH.toString();

const run = module.exports = function() {
    let ngramsByStart;
    try {
        // ngramsByStart = require('./probs');
    } catch(e) {}


    return _train(ngramsByStart, (err, ngramsByStart) => {
        let cleanOutput = _generate(ngramsByStart);
        console.log(cleanOutput);
        _tweet(cleanOutput);
    })
}

run();

function _train(ngramsByStart, next) {
    if (ngramsByStart) return next(null, ngramsByStart);

    fs.readFile(TRAINING_DATA_PATH, (err, contents) => {

        if (TRAINING_DATA_PATH === './datasets/arcade_fire.json')
            contents = JSON.stringify(JSON.parse(contents).map((el) => el.text));
        else if (TRAINING_DATA_PATH === './datasets/djt.json')
            contents = JSON.stringify(JSON.parse(contents).slice(0, 1000));

        // console.log(contents.toString());
        contents = contents.toString().toLowerCase().replace(/\.\s/g, ' ' + START + ' ' + END + ' ')
        // console.log(contents);

        var phrases = JSON.parse(contents.toString());
        // var phrases = contents.toString().toLowerCase().split(new RegExp(SPLIT)) //.split(/\.\s/);
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
            hash[ngram.toString()] = ngramCounts[ngram.toString()] / nm1gramCounts[nm1gram.toString()];
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

function _generate(ngramsByStart) {
    var outupt = _generate(ngramsByStart);
    // console.log(outupt);
    var cleanOutput = _cleanOutput(outupt);
    return cleanOutput;
}

function _tweet(cleanOutput) {
    if (TWEET) twitter.post(cleanOutput);
}

function _generate(_ngramsByStart, phrase='', start=START_MATCH) {
    // phrase = phrase || '';
    // start = start || START;
    if (start === END_MATCH) return phrase;

    var possibleNGrams = _ngramsByStart[start];
    var r = Math.floor(Math.random() * possibleNGrams.length);
    var ngram = possibleNGrams[r].ngram;
    phrase += ' ' + ngram.slice(OVERLAP_WINDOW).join(' ');
    return _generate(_ngramsByStart, phrase, ngram.slice(ngram.length - OVERLAP_WINDOW).toString());
}

function _cleanOutput(str) {
    return str
        .replace(/ 000 /g, '\n ').replace(/ 000 /g, '\n ')
        .replace(new RegExp(START, 'g'), '')
        .replace(new RegExp(END, 'g'), '');
}
