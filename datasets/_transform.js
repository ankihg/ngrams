var fs = require('fs');
var songs = require('./arcade_fire');

var str = songs.reduce((str, song) => {
    var txt = song.text; //.replace(/\n/g, '. ');
    var txt = song.text.replace(/\n/g, ' 000 ');
    return str + '. ' +  txt;
}, '');

console.log(str);
fs.writeFile(__dirname + '/arcade_fire.txt', str, (err) => { err && console.log(err);})
