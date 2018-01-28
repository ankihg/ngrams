const fs = require('fs');
const natural = require('natural');
var tokenizer = new natural.WordTokenizer();

fs.readFile('./juco.txt', (err, contents) => {
    // console.log(tokenizer.tokenize(contents.toString().toLowerCase()));
    console.log(natural.NGrams.ngrams(['i love butterflies', 'butterflies are so cool'], 3, '[start]', '[end]'));
});
