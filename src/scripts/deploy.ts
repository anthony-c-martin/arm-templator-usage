import { buildDeployment } from 'arm-templator';
import { default as template } from './template'

const subscriptionId = '319b29d4-ae29-421c-b557-eac405f673b6';
const resourceGroup = 'antscripts';

export default buildDeployment(
  { 
    location: 'West US',
    subscriptionId,
    resourceGroup,
    name: 'antscripts',
    mode: 'Complete',
  },
  template,
  {
    myName: 'Anthony Martin',
  }
);