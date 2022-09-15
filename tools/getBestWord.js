const calcLetterScore = require('./calcLetterScore');

module.exports = {
    find: (palavras) => {
        const letterScore = calcLetterScore.calc(palavras);

        const wordsRanking = palavras.map((palavra) => {
            return { palavra, score: palavra.split('').map((letter, index) => {
                if (palavra.indexOf(letter) < index) return 0;
                return letterScore[letter]
            }).reduce((carry, item) => carry + item, 0) };
        }).sort((a, b) => a.score - b.score).reverse()

        return wordsRanking[0].palavra;
    }
}