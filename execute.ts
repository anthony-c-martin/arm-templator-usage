import path = require('path');

const execPath = path.resolve(process.argv[2]);
const template = require(execPath).default;

console.log(JSON.stringify(template, null, 2));