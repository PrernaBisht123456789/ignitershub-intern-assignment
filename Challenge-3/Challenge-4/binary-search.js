const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Binary search function
function performBinarySearch(arr, target) { 
  let start = 0;
  let end = arr.length - 1;
  
  while (start <= end) {
    // Calculate middle index
    const mid = Math.floor((start + end) / 2);
    
    // Check if target is at middle position
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target is smaller, search left half
    if (arr[mid] > target) {
      end = mid - 1;
    } 
    // If target is larger, search right half
    else {
      start = mid + 1;
    }
  }
  
  // Target not found
  return -1;
}

// Predefined sorted array
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

console.log('Binary Search Program');
console.log('====================');
console.log(`The array: [${sortedArray.join(', ')}]\n`);

// Prompt user for target element
rl.question('Enter the target element: ', (input) => {
  const target = parseInt(input);
  
  // Perform binary search
  const result = performBinarySearch(sortedArray, target);
  
  // Display result
  if (result !== -1) {
    console.log(`Element ${target} is found at index ${result}.`);
  } else {
    console.log(`Element ${target} is not found in the array.`);
  }
  
  // Close the interface
  rl.close();
});