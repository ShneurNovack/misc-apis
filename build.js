// build.js
const fs = require('fs');
const workerCode = fs.readFileSync('functions/openai.js', 'utf8');
const modifiedCode = workerCode.replace('__OPENAI_KEY__', process.env.OPENAI_KEY);
fs.writeFileSync('worker.js', modifiedCode);
