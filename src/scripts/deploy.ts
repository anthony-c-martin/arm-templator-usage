import { Deployment } from 'arm-templator';
import { default as template } from './template'

const subscriptionId = '319b29d4-ae29-421c-b557-eac405f673b6';
const resourceGroup = 'antscripts';

const deployment: Deployment = {
  location: 'West US',
  subscriptionId,
  resourceGroup,
  name: 'antscripts',
  mode: 'Complete',
  template: template,
  parameters: {
    myName: 'Anthony Martin',
  }
}

export default deployment;