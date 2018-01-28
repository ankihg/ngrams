var fs = require('fs');
var songs = require('./arcade_fire');

var str = songs.reduce((str, song) => {
    return str + '. ' +  song.text;
}, '');

console.log(str);
fs.writeFile('./arcade_fire.txt', str, (err) => { err && console.log(err);})
