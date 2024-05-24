const readline = require('readline');

class PlayfairCipher {
    constructor(keyword) {
        this.matrix = this.generateMatrix(keyword);
        this.printMatrix();
    }

    generateMatrix(keyword) {
        let uniqueKeyword = '';
        for (let char of keyword.toUpperCase()) {
            if (!uniqueKeyword.includes(char) && char !== 'J') {
                uniqueKeyword += char;
            }
        }

        let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
        let fullKey = uniqueKeyword;
        for (let char of alphabet) {
            if (!fullKey.includes(char)) {
                fullKey += char;
            }
        }

        let matrix = [];
        for (let i = 0; i < 5; i++) {
            matrix.push(fullKey.slice(i * 5, (i + 1) * 5).split(''));
        }
        return matrix;
    }

    printMatrix() {
        console.log("Matriz de Cifrado Playfair:");
        for (let row of this.matrix) {
            console.log(row.join(' '));
        }
    }

    preprocessMessage(message) {
        let processedMessage = '';
        message = message.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

        for (let i = 0; i < message.length; i += 2) {
            let first = message[i];
            let second = message[i + 1] || 'X';

            if (first === second) {
                processedMessage += first + 'X';
                i--;
            } else {
                processedMessage += first + second;
            }
        }
        return processedMessage;
    }

    findPosition(char) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.matrix[row][col] === char) {
                    return { row, col };
                }
            }
        }
        throw new Error(`Character ${char} not found in matrix`);
    }

    encryptPair(pair) {
        let pos1 = this.findPosition(pair[0]);
        let pos2 = this.findPosition(pair[1]);

        if (pos1.row === pos2.row) {
            return this.matrix[pos1.row][(pos1.col + 1) % 5] + this.matrix[pos2.row][(pos2.col + 1) % 5];
        } else if (pos1.col === pos2.col) {
            return this.matrix[(pos1.row + 1) % 5][pos1.col] + this.matrix[(pos2.row + 1) % 5][pos2.col];
        } else {
            return this.matrix[pos1.row][pos2.col] + this.matrix[pos2.row][pos1.col];
        }
    }

    encrypt(message) {
        let preprocessedMessage = this.preprocessMessage(message);
        console.log("Mensaje Preprocesado:", preprocessedMessage);
        let encryptedMessage = '';

        for (let i = 0; i < preprocessedMessage.length; i += 2) {
            let pair = preprocessedMessage.slice(i, i + 2);
            let encryptedPair = this.encryptPair(pair);
            console.log(`Par Original: ${pair} -> Par Encriptado: ${encryptedPair}`);
            encryptedMessage += encryptedPair;
        }
        return encryptedMessage;
    }

    decryptPair(pair) {
        let pos1 = this.findPosition(pair[0]);
        let pos2 = this.findPosition(pair[1]);

        if (pos1.row === pos2.row) {
            return this.matrix[pos1.row][(pos1.col + 4) % 5] + this.matrix[pos2.row][(pos2.col + 4) % 5];
        } else if (pos1.col === pos2.col) {
            return this.matrix[(pos1.row + 4) % 5][pos1.col] + this.matrix[(pos2.row + 4) % 5][pos2.col];
        } else {
            return this.matrix[pos1.row][pos2.col] + this.matrix[pos2.row][pos1.col];
        }
    }

    decrypt(message) {
        let decryptedMessage = '';

        for (let i = 0; i < message.length; i += 2) {
            let pair = message.slice(i, i + 2);
            let decryptedPair = this.decryptPair(pair);
            console.log(`Par Encriptado: ${pair} -> Par Desencriptado: ${decryptedPair}`);
            decryptedMessage += decryptedPair;
        }

        let cleanedMessage = '';
        for (let i = 0; i < decryptedMessage.length; i++) {
            let char = decryptedMessage[i];
            if (char === 'X' && (
                (i > 0 && decryptedMessage[i - 1] === decryptedMessage[i + 1]) || 
                (i === decryptedMessage.length - 1 && decryptedMessage[i - 1] !== 'X')
            )) {
                continue;
            }
            cleanedMessage += char;
        }

        return cleanedMessage;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let playfair;

function showMenu() {
    console.log("\nMenú:");
    console.log("1. Ingresar palabra clave");
    console.log("2. Encriptar frase");
    console.log("3. Desencriptar frase");
    console.log("4. Salir");
    rl.question("Elija una opción: ", function(option) {
        switch (option) {
            case '1':
                rl.question("Ingrese la palabra clave: ", function(keyword) {
                    playfair = new PlayfairCipher(keyword);
                    showMenu();
                });
                break;
            case '2':
                if (!playfair) {
                    console.log("Primero debe ingresar la palabra clave.");
                    showMenu();
                    break;
                }
                rl.question("Ingrese la frase a encriptar: ", function(message) {
                    const encryptedMessage = playfair.encrypt(message);
                    console.log('Mensaje Encriptado:', encryptedMessage);
                    showMenu();
                });
                break;
            case '3':
                if (!playfair) {
                    console.log("Primero debe ingresar la palabra clave.");
                    showMenu();
                    break;
                }
                rl.question("Ingrese la frase a desencriptar: ", function(message) {
                    if (!/^[A-Z]+$/.test(message)) {
                        console.log("El mensaje debe estar en mayúsculas y no debe contener caracteres no alfabéticos.");
                        showMenu();
                        return;
                    }
                    const decryptedMessage = playfair.decrypt(message);
                    console.log('Mensaje Desencriptado:', decryptedMessage);
                    showMenu();
                });
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log("Opción no válida.");
                showMenu();
                break;
        }
    });
}

showMenu();
