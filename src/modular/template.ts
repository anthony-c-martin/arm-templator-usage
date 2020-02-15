import { renderTemplate, concat, resourceGroupLocation, getResourceId } from 'arm-templator';
import { virtualMachines } from 'arm-templator-types/dist/compute/2019-07-01';
import { networkInterfaces, virtualNetworks, publicIPAddresses } from 'arm-templator-types/dist/network/2019-11-01';
import { createBaseNic, createBaseVm } from './utils';

export default renderTemplate(template => {
  const location = resourceGroupLocation();
  const namePrefix = template.addStringParameter('namePrefix', 'test');

  const publicIp = template.deploy(
    publicIPAddresses.create(
      concat(namePrefix, '-pip'),
      {
        publicIPAllocationMethod: 'Dynamic',
      },
      location),
    []);

  const vnet = template.deploy(
    virtualNetworks.create(
      concat(namePrefix, '-vnet'),
      {
        addressSpace: {
          addressPrefixes: [
            '10.0.0.0/24'
          ]
        }
      },
      location),
    []);

  const subnet = template.deploy(
    virtualNetworks.subnets.create(
      [namePrefix, 'default'],
      {
        addressPrefix: '10.0.0.0/24'
      },
      location),
    [vnet]);

  for (let i = 0; i < 2; i++) {
    const nic = template.deploy(
      networkInterfaces.create(
        concat(namePrefix, `-nic${i}`),
        createBaseNic(getResourceId(subnet), getResourceId(publicIp)),
        location),
      [subnet, publicIp]);

    const vm = template.deploy(
      virtualMachines.create(
        concat(namePrefix, `-vm${i}`),
        createBaseVm(`vm${i}`, getResourceId(nic)),
        location),
      [nic]);
  }
});