// Import necessary Node.js modules
const fs = require('fs');
const readline = require('readline');
const path = require('path'); // ✅ added

// Function to calculate Levenshtein distance between two strings
function calculateDistance(str1, str2) {
    const string1 = str1.toLowerCase();
    const string2 = str2.toLowerCase();
    
    const len1 = string1.length;
    const len2 = string2.length;

    const matrix = [];
    
    // Initialize the matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [];
        matrix[i][0] = i;
    }
    
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (string1[i - 1] === string2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }
    
    return matrix[len1][len2];
}

// Function to load words from text file
function loadWordsFromFile(filename) {
    try {
        const fileContent = fs.readFileSync(filename, 'utf-8');
        const words = fileContent
            .split('\n')
            .map(word => word.trim())
            .filter(word => word.length > 0);
        
        return words;
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return [];
    }
}

function findTopKSimilar(inputWord, wordList, k) {
    const wordsWithDistances = wordList.map(word => ({
        word: word,
        distance: calculateDistance(inputWord, word)
    }));

    wordsWithDistances.sort((a, b) => a.distance - b.distance);
    
    return wordsWithDistances.slice(0, k).map(item => item.word);
}

// Main function
function main() {
    // ✅ FIXED PATH HERE
    const filePath = path.join(__dirname, 'words.txt');
    const words = loadWordsFromFile(filePath);
    
    if (words.length === 0) {
        console.log('No words loaded. Please check words.txt file.');
        return;
    }
    
    console.log(`Loaded ${words.length} words from file.`);
    console.log('Interactive Approximate Search Program');
    console.log('Type a word and press Enter to find similar words.');
    console.log('Type "exit" to quit.\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const promptUser = () => {
        rl.question('Input >> ', (input) => {
            const userInput = input.trim();
            
            if (userInput.toLowerCase() === 'exit') {
                console.log('Goodbye!');
                rl.close();
                return;
            }
            
            if (userInput === '') {
                console.log('Please enter a word.\n');
                promptUser();
                return;
            }

            const k = 3;
            const similarWords = findTopKSimilar(userInput, words, k);
            
            console.log(`Output >> ${similarWords.join(', ')}\n`);
            promptUser();
        });
    };

    promptUser();
}

main();
