const fs = require('fs');

let rawdata = fs.readFileSync('data/letters_frequency.json');
let frequency = JSON.parse(rawdata);

rawdata = fs.readFileSync('data/palavras.json');
let palavras = JSON.parse(rawdata);

const wordsRate = palavras.map((palavra) => {
    return palavra.split('').map((letter, index) => {
        if (palavra.indexOf(letter) < index) return 0;
        return frequency[letter]
    }).reduce((carry, item) => carry + item, 0);
})

const theBestWord = palavras[wordsRate.indexOf(wordsRate.reduce((carry,item) => carry > item ? carry : item))];

console.log("THE BEST WORD IS:", theBestWord, wordsRate);