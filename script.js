const fs = require('fs');
const natural = require('natural');
// var tokenizer = new natural.WordTokenizer();
//
// fs.readFile('./juco.txt', (err, contents) => {
//     // console.log(tokenizer.tokenize(contents.toString().toLowerCase()));
//     console.log(natural.NGrams.ngrams(['i love butterflies', 'butterflies are so cool'], 3, '[start]', '[end]'));
// });

var wordnet = new natural.WordNet();

// wordnet.lookup('suburb', function(results) {
//     results.forEach(function(result) {
//         console.log('------------------------------------');
//         console.log(result.synsetOffset);
//         console.log(result.pos);
//         console.log(result.lemma);
//         console.log(result.synonyms);
//         console.log(result.pos);
//         console.log(result.gloss);
//     });
// });

wordnet.get(8571977, 'n', function(result) {
    console.log('------------------------------------');
    console.log(result.lemma);
    console.log(result.pos);
    console.log(result.gloss);
    console.log(result.synonyms);
    console.log(result);
});
