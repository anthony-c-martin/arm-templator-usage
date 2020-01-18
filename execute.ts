import { series } from 'async';
import path = require('path');
import { Template, renderTemplate } from 'arm-templator/dist/template';

series([async () => {
  const execPath = path.resolve(process.argv[2]);
  const execute = (await import(execPath)).default;
  
  const template = new Template();
  execute(template);
  
  const generated = renderTemplate(template);
  console.log(JSON.stringify(generated, null, 2));
}]);