import { renderTemplate, resourceGroupLocation, getReference } from 'arm-templator';
import { createScriptsResource } from './helper';

export default renderTemplate(template => {
  const location = resourceGroupLocation();
  const name = template.addStringParameter('myName');

  const script = template.deploy(createScriptsResource(
    'hello',
    location,
    `${__dirname}/hello.ps1`,
    {
      name,
    }), []);

  const ref = getReference(script);
  template.addObjectOutput('text', ref.call('output').call('text'));
});