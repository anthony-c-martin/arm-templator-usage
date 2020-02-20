import { resourceGroupLocation, buildTemplate, Params } from 'arm-templator';
import { default as builder } from './nestedTemplate';

const params = {
  namePrefix: Params.String,
  subnetResourceId: Params.String,
}

export default buildTemplate(params, {}, (params, template) => {
  const { namePrefix, subnetResourceId } = params;
  const location = resourceGroupLocation();

  for (let i = 0; i < 3; i++) {
    const result = template.deployNested(
      `nested${i}`,
      location,
      builder,
      {
        index: i.toString(),
        namePrefix,
        subnetResourceId,
      });
  }

  return {};
});