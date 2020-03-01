import { resourceGroupLocation, getReference, buildTemplate, Params, Outputs } from 'arm-templator';
import { createScriptsResource } from './helper';

const params = {
  myName: Params.String,
}

const outputs = {
  text: Outputs.String,
}

export default buildTemplate(params, outputs, (params, template) => {
  const location = resourceGroupLocation();
  const { myName } = params;

  const script = template.deploy(createScriptsResource(
    'hello',
    location,
    `${__dirname}/hello.ps1`,
    {
      name: myName,
    }), []);

  const ref = getReference(script);

  return {
    text: ref.call<any>('output').call('text'),
  };
});