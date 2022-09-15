const fs = require('fs');

module.exports = {
    calc: (palavras) => {
        const letras = {"a": 0,"b": 0,"c": 0,"d": 0,"e": 0,"f": 0,"g": 0,"h": 0,"i": 0,"j": 0,"k": 0,"l": 0,"m": 0,"n": 0,
            "o": 0,"p": 0,"q": 0,"r": 0,"s": 0,"t": 0,"u": 0,"v": 0,"x": 0,"z": 0};

        const palavrao = palavras.join('').toLowerCase()
        for (let i = 0 ; i < palavrao.length ; i++) {
            letras[palavrao[i]] += 1;
        }

        const result = {}
        Object.keys(letras).forEach(i => result[i] = 100 / (palavrao.length / letras[i]));
        return result;
    }
}
