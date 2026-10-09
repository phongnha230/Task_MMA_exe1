const fs = require('fs');
const path = require('path');

// docx is a zip file, let's extract word/document.xml if possible or read with a simple regex
// Since we don't have adm-zip, let's see if we can read document.xml using node's built-in buffer searching or we can just see
console.log('Script ready');
