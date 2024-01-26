const fs = require('fs');
const path = require('path');

const fontFilePath = 'HinaMincho-Regular.ttf';
const outputFilePath = 'base64FontData.txt'; // Set the desired output file path

try {
  const fontData = fs.readFileSync(fontFilePath);
  const base64FontData = fontData.toString('base64');

  // Save the Base64-encoded font data to a text file
  fs.writeFileSync(outputFilePath, base64FontData);

  console.log('Base64 font data saved to:', outputFilePath);
} catch (error) {
  console.error('Error reading or writing file:', error);
}