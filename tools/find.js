const fs = require('fs');

let rawdata = fs.readFileSync('data/palavras.json');
const palavras = JSON.parse(rawdata);

const regex = /^[^rosezumb]{5}$/;
const palavrarsFiltradas = palavras.filter((palavra) => regex.test(palavra));

console.log("QUANTIDADE:", palavrarsFiltradas.length);

