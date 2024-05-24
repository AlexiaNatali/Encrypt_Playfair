function createMatrix(secretWord, wordToEncode) {
    secretWord = secretWord.toLowerCase();
    wordToEncode = wordToEncode.toLowerCase();

    let abc = [];
    let wordLetters = secretWord.split('');
    for (let letter of wordLetters) {
        if (letter !== 'j' && letter !== 'ñ' && !abc.includes(letter)) {
            abc.push(letter);
        }
    }
    for (let i = 97; i <= 122; i++) {
        let letter = String.fromCharCode(i);
        if (letter !== 'j' && letter !== 'ñ' && !abc.includes(letter)) {
            abc.push(letter);
        }
    }
    const size = Math.ceil(Math.sqrt(abc.length));

    while (abc.length < size * size) {
        abc.push('x');
    }

    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix.push(abc.slice(i * size, (i + 1) * size));
    }

    let encodedPairs = [];
    let tempPair = '';
    for (let i = 0; i < wordToEncode.length; i++) {
        if (wordToEncode[i] === ' ') continue; 
        tempPair += wordToEncode[i];
        if (tempPair.length === 2 || i === wordToEncode.length - 1) {
            if (tempPair[0] === tempPair[1]) {
                encodedPairs.push(tempPair[0] + 'x');
                tempPair = tempPair[1];
            } else if (tempPair.length === 1) {
                tempPair += 'x'; 
                encodedPairs.push(tempPair);
                tempPair = '';
            } else {
                encodedPairs.push(tempPair);
                tempPair = '';
            }
        }
    }

    return [matrix, encodedPairs];
}

const secretWord = process.argv[2];
const wordToEncode = process.argv.slice(3).join(' '); 

if (!secretWord || !wordToEncode) {
    console.log("Por favor ingresa una palabra secreta y una palabra para codificar.");
} else {
    let matrixAndPairs = createMatrix(secretWord, wordToEncode);
    console.log(matrixAndPairs);
}