// Import necessary Node.js modules
const fs = require('fs');
const readline = require('readline');

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
                // Take minimum of insert, delete, or substitute
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,      // deletion
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j - 1] + 1   // substitution
                );
            }
        }
    }
    
    // Return the final distance
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
    // Calculate distance for each word and store with the word
    const wordsWithDistances = wordList.map(word => ({
        word: word,
        distance: calculateDistance(inputWord, word)
    }));
    wordsWithDistances.sort((a, b) => a.distance - b.distance);
    
    // Take top k results
    const topK = wordsWithDistances.slice(0, k);
    
    // Return only the words (not distances)
    return topK.map(item => item.word);
}

// Main function to run the interactive program
function main() {
    // Load words from file
    const words = loadWordsFromFile('words.txt');
    
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
            
            // Check if user wants to exit
            if (userInput.toLowerCase() === 'exit') {
                console.log('Goodbye!');
                rl.close();
                return;
            }
            
            // Check if input is empty
            if (userInput === '') {
                console.log('Please enter a word.\n');
                promptUser();
                return;
            }
            const k = 3;
            const similarWords = findTopKSimilar(userInput, words, k);
            
            // Display results
            console.log(`Output >> ${similarWords.join(', ')}\n`);
            promptUser();
        });
    };
    promptUser();
}
main();