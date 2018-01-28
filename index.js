const natural = require('natural');
const fs = require('fs');

const START = '[start]';
const END = '[end]';

fs.readFile('./juco.txt', (err, contents) => {
    // console.log(contents.toString());
    // contents = contents.toString().toLowerCase().replace(/\.\s/g, ' ' + START + ' ' + END + ' ')
    // console.log(contents);
    var phrases = contents.toString().toLowerCase().split(/\.\s/);

    let grams = phrases.reduce((acc, phrase) => {
        acc.nm1grams = acc.nm1grams.concat(natural.NGrams.ngrams(phrase, 2, START, END));
        acc.ngrams = acc.ngrams.concat(natural.NGrams.ngrams(phrase, 3, START, END));
        return acc;
    }, {
        nm1grams: [],
        ngrams: [],
    });

    var _2gramCounts = grams.nm1grams
        .reduce((hash, _3gram) => {
            hash[_3gram.toString()] = hash[_3gram.toString()] || 0;
            hash[_3gram.toString()]++;
            return hash;
        }, {});

    var _3gramCounts = grams.ngrams
        .reduce((hash, gram) => {
            hash[gram.toString()] = hash[gram.toString()] || 0;
            hash[gram.toString()]++;
            return hash;
        }, {});

    var _3gramProbs = Object.keys(_3gramCounts).reduce((hash, _3gramKey) => {
        var _3gram = _3gramKey.split(',');
        var _2gram = _3gram.slice(0, _3gram.length - 1);
        hash[_3gram.toString()] = _3gramCounts[_3gram.toString()] / _2gramCounts[_2gram.toString()]
        return hash;
    }, {});

    var _3gramsByStart = Object.keys(_3gramCounts).reduce((hash, _3gramKey) => {
        var _3gram = _3gramKey.split(',');
        hash[_3gram[0]] = hash[_3gram[0]] || [];
        hash[_3gram[0]].push({prob: _3gramProbs[_3gramKey], ngram: _3gram});
        return hash;
    }, {});
    // console.log('_3gramsByStart', JSON.stringify(_3gramsByStart, null, 4));
    fs.writeFile('./probs.json', JSON.stringify(_3gramsByStart, null, 4), (err) => { err && console.log(err);})

    console.log(_generate(_3gramsByStart));
});


function _generate(_ngramsByStart, phrase='', start=START) {
    // phrase = phrase || '';
    // start = start || START;
    if (start === END) return phrase;

    var possibleNGrams = _ngramsByStart[start];
    var r = Math.floor(Math.random() * possibleNGrams.length);
    var ngram = possibleNGrams[r].ngram;
    phrase += ' ' + ngram.slice(1).join(' ');
    return _generate(_ngramsByStart, phrase, ngram[ngram.length - 1]);
}
