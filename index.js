const natural = require('natural');
const fs = require('fs');

const START = '<start>';
const END = '<end>';
const N = 5;
const OVERLAP_WINDOW = 2;

fs.readFile('./datasets/arcade_fire.txt', (err, contents) => {
    // console.log(contents.toString());
    // contents = contents.toString().toLowerCase().replace(/\.\s/g, ' ' + START + ' ' + END + ' ')
    // console.log(contents);
    var phrases = contents.toString().toLowerCase().split(/\.\s/);

    let grams = phrases.reduce((acc, phrase) => {
        acc.nm1grams = acc.nm1grams.concat(natural.NGrams.ngrams(phrase, N - OVERLAP_WINDOW, START, END));
        acc.ngrams = acc.ngrams.concat(natural.NGrams.ngrams(phrase, N, START, END));
        return acc;
    }, {
        nm1grams: [],
        ngrams: [],
    });

    var nm1gramCounts = grams.nm1grams
        .reduce((hash, ngram) => {
            hash[ngram.toString()] = hash[ngram.toString()] || 0;
            hash[ngram.toString()]++;
            return hash;
        }, {});

    var ngramCounts = grams.ngrams
        .reduce((hash, gram) => {
            hash[gram.toString()] = hash[gram.toString()] || 0;
            hash[gram.toString()]++;
            return hash;
        }, {});

    var ngramProbs = Object.keys(ngramCounts).reduce((hash, ngramKey) => {
        var ngram = ngramKey.split(',');
        var nm1gram = ngram.slice(0, ngram.length - 1);
        hash[ngram.toString()] = ngramCounts[ngram.toString()] / nm1gramCounts[nm1gram.toString()];
        // console.log(hash[ngram.toString()], ngramKey, ngramCounts[ngram.toString()], nm1gram.toString(), nm1gramCounts[nm1gram.toString()]);
        // if (!(ngramCounts[ngram.toString()] / nm1gramCounts[nm1gram.toString()]))
        //     console.log(ngramKey, nm1gramCounts[nm1gram.toString()]);
        return hash;
    }, {});

    var ngramsByStart = Object.keys(ngramCounts).reduce((hash, ngramKey) => {
        var ngram = ngramKey.split(',');
        hash[ngram[0]] = hash[ngram[0]] || [];
        hash[ngram[0]].push({prob: ngramProbs[ngramKey], ngram: ngram});
        return hash;
    }, {});
    // console.log('ngramsByStart', JSON.stringify(ngramsByStart, null, 4));
    fs.writeFile('./probs.json', JSON.stringify(ngramsByStart, null, 4), (err) => { err && console.log(err);})

    var outupt = _generate(ngramsByStart);
    // console.log(outupt);
    console.log(_cleanOutput(outupt));
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

function _cleanOutput(str) {
    return str
        .replace(/ 000 /g, '\n ').replace(/ 000 /g, '\n ')
        .replace(new RegExp(START, 'g'), '')
        .replace(new RegExp(END, 'g'), '');
}
