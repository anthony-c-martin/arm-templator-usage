import { Deployment } from 'arm-templator';
import { default as builder } from './template'

const subscriptionId = '319b29d4-ae29-421c-b557-eac405f673b6';
const resourceGroup = 'anttestrg';

export default new Deployment(
  'West US',
  subscriptionId,
  resourceGroup,
  'anttest',
  'Complete',
  builder,
  {
    namePrefix: 'anttest',
  }
);