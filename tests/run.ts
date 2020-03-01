import 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

function executeTest(input: string, output: string) {
  input = path.resolve(__dirname, input);
  output = path.resolve(__dirname, output);

  //fs.writeFileSync(output, JSON.stringify(generated, null, 2), {encoding:'utf8'});

  const generated = require(input).default.renderTemplate();
  const expected = fs.readFileSync(output, { encoding: 'utf8' });
  
  expect(generated).to.deep.equal(JSON.parse(expected));
}

describe('generation tests', () => {
  it('basic', () => executeTest('../src/basic/deploy.ts', './basic.json'));
  it('custom', () => executeTest('../src/custom/deploy.ts', './custom.json'));
  it('modular', () => executeTest('../src/modular/deploy.ts', './modular.json'));
  it('nested', () => executeTest('../src/nested/deploy.ts', './nested.json'));
  it('scripts', () => executeTest('../src/scripts/deploy.ts', './scripts.json'));
});