const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to check if a string is a palindrome
function checkPalindrome(str) {
  // Remove spaces and convert to lowercase for comparison
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Reverse the cleaned string
  const reversed = cleaned.split('').reverse().join('');
  
  // Compare original with reversed
  return cleaned === reversed;
}

// Prompt user for input
rl.question('Enter a string : ', (userInput) => {
  // Check if the input is a palindrome
  const isPalindrome = checkPalindrome(userInput);
  
  // Display result
  if (isPalindrome) {
    console.log(`The string '${userInput}' is a palindrome.`);
  } else {
    console.log(`The string '${userInput}' is not a palindrome.`);
  }
  
  // Close the readline interface
  rl.close();
});