const prompts = require('prompts');
const words = require('./data/palavras.json');
const getBestWord = require('./tools/getBestWord');

prompts.override(require('yargs').argv);

class LetterRule {
    excluded: String[] = [];
    letter: String;
}

class Termo {

    private readonly bestInitialWord;
    private currentWord: String;

    private readonly secretLetterRules: LetterRule[] = [
        new LetterRule(),
        new LetterRule(),
        new LetterRule(),
        new LetterRule(),
        new LetterRule()
    ];

    private mustHaveLetters: String[] = [];
    private dontHaveLetter: String[] = [];

    constructor() {
        this.bestInitialWord = getBestWord.find(words.filter(w => w.indexOf('a') !== -1).filter(w => w.indexOf('r') !== -1));
    }

    private resolveLetter(index, result) {
        const currentLetter = this.currentWord[index];
        if (result === '1') {
            this.secretLetterRules[index].letter = currentLetter;
            return;
        }

        if (result === '2') {
            this.secretLetterRules[index].excluded.push(currentLetter);
            this.mustHaveLetters.push(currentLetter);
            return;
        }

        if (result === '3') this.dontHaveLetter.push(currentLetter);
    }

    private calculateNextWord() {
        const letterRegex = this.secretLetterRules.map(letterRule => {
            if (letterRule.letter) return letterRule.letter;
            const excluded = this.dontHaveLetter.concat(letterRule.excluded).join();
            return `(?![${excluded}])[a-z]`
        }).join('');
        const excludedLetters = new RegExp(`^${letterRegex}$`);
        const includedLetters = new RegExp(this.mustHaveLetters.map(letter => `(?=.*${letter})`).join(''));

        const possibleWords = words
            .filter(word => excludedLetters.test(word))
            .filter(word => includedLetters.test(word));

        if (possibleWords.length === 1) {
            console.log("THE WORD IS:", possibleWords[0]);
            process.exit(0);
        }
        if (possibleWords.length < 20) {
            console.log("POSSIBLE WORDS:", possibleWords);
            process.exit(0);
        }

        return getBestWord.find(possibleWords);
    }

    public async init() {
        this.currentWord = this.bestInitialWord;
        for (let x = 0 ; x < 6 ; x++) {
            const questions = [
                {
                    type: 'text',
                    name: 'none',
                    message: (x === 0 ? 'Hello!\nThis is a term.ooo assistance. I will help you to right the unknown word of today.\n' : '') +
                        `Please, insert the "${this.currentWord.toUpperCase()}" in site and following press enter here.`
                },
                {
                    type: 'select',
                    name: 'letter_0',
                    message: `Great!\nNow, tell me about the results.\nSelect the color of first letter "${this.currentWord[0]}":`,
                    choices: [
                        { title: 'Black', value: '3' },
                        { title: 'Yellow', value: '2' },
                        { title: 'Green', value: '1' },
                    ]
                }
            ];
            for (let x = 1; x < 5; x++) {
                questions.push({
                    type: 'select',
                    name: `letter_${x}`,
                    message: `Letter "${this.currentWord[x]}" at position ${x+1} what color is?`,
                    choices: [
                        { title: 'Black', value: '3' },
                        { title: 'Yellow', value: '2' },
                        { title: 'Green', value: '1' },
                    ]
                })
            }

            const answers = await prompts(questions);
            delete answers['none'];

            this.resolveLetter(0, answers['letter_0']);
            this.resolveLetter(1, answers['letter_1']);
            this.resolveLetter(2, answers['letter_2']);
            this.resolveLetter(3, answers['letter_3']);
            this.resolveLetter(4, answers['letter_4']);

            this.currentWord = this.calculateNextWord();
        }

        console.log("SORRY U LOST.");
    }
}

new Termo().init().then(() => console.log("PROCESS FINISH."));