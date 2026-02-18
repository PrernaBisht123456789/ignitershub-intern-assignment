const fs = require('fs');
const path = require('path');

// Function to tokenize the mathematical expression
function tokenizeExpression(expr) {
  const tokens = [];
  let currentToken = '';
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    
    if (/\s/.test(char)) {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }
    } else if (/[+\-*\/()^]/.test(char)) {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }
      tokens.push(char);
    } else if (/\d/.test(char)) {
      currentToken += char;
    } else if (char === '-' && (tokens.length === 0 || /[+\-*\/()^]/.test(tokens[tokens.length - 1]))) {
      currentToken += char;
    }
  }
  
  if (currentToken) {
    tokens.push(currentToken);
  }
  
  return tokens;
}

// Function to evaluate mathematical expressions following PEMDAS
function evaluateExpression(expr) {
  try {
    // Remove the equals sign if present
    expr = expr.trim().replace(/\s*=\s*$/, '').trim();
    
    // Replace ^ with ** for JavaScript exponentiation
    expr = expr.replace(/\^/g, '**');
    
    // Evaluate using Function constructor to avoid eval security issues
    const result = Function('"use strict"; return (' + expr + ')')();
    
    // Return result as integer if it's a whole number, otherwise round to 2 decimals
    if (Number.isInteger(result)) {
      return result;
    } else {
      return Math.round(result * 100) / 100;
    }
  } catch (error) {
    return 'Error: Invalid expression';
  }
}

// Function to read input file and process expressions
function processArithmeticFile(inputPath, outputPath) {
  try {
    // Read input file
    const inputContent = fs.readFileSync(inputPath, 'utf-8');
    const lines = inputContent.split('\n');
    
    let outputContent = '';
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        continue;
      }
      
      // Extract the expression part (before the equals sign)
      const expressionMatch = line.match(/^(.+?)\s*=\s*$/);
      if (!expressionMatch) {
        continue;
      }
      
      const expression = expressionMatch[1].trim();
      
      // Evaluate the expression
      const result = evaluateExpression(expression);
      
      // Format output line
      const outputLine = `${expression} = ${result}\n`;
      outputContent += outputLine;
    }
    
    // Write to output file
    fs.writeFileSync(outputPath, outputContent, 'utf-8');
    
    console.log(`✓ Successfully processed expressions!`);
    console.log(`✓ Output saved to: ${outputPath}`);
    
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
  }
}

// Main execution
const inputFile = path.join(__dirname, 'input.txt');
const outputFile = path.join(__dirname, 'output.txt');

processArithmeticFile(inputFile, outputFile);