const fs = require('fs');
const path = require('path');

const fontFilePath = 'NotoSansJP-VariableFont_wght.ttf'; 

const fontData = fs.readFileSync(fontFilePath);
const base64FontData = fontData.toString('base64');

console.log(base64FontData);