import { renderTemplate, concat, resourceGroupLocation, getResourceId } from 'arm-templator';
import { virtualMachines } from 'arm-templator-types/dist/compute/2019-07-01';
import { networkInterfaces, publicIPAddresses } from 'arm-templator-types/dist/network/2019-11-01';
import { createBaseNic, createBaseVm } from '../modular/utils';
import { ResourceReference } from 'arm-templator/dist/common';

export default renderTemplate(template => {
  const location = resourceGroupLocation();
  const namePrefix = template.addStringParameter('namePrefix');
  const subnetResourceId = template.addStringParameter('subnetResourceId');

  const vms: ResourceReference<any>[] = [];

  for (let i = 0; i < 3; i++) {
    const script = template.deployNested(
      `nested${i}`,
      location,
      nested => {
        const publicIp = template.deploy(
          publicIPAddresses.create(
            concat(namePrefix, `-pip${i}`),
            {
              publicIPAllocationMethod: 'Dynamic',
            },
            location),
          []);

        const nic = template.deploy(
          networkInterfaces.create(
            concat(namePrefix, `-nic${i}`),
            createBaseNic(subnetResourceId, getResourceId(publicIp)),
            location),
          [publicIp]);
    
        const vm = template.deploy(
          virtualMachines.create(
            concat(namePrefix, `-vm${i}`),
            createBaseVm(`vm${i}`, getResourceId(nic)),
            location),
          [nic]);

        vms.push(vm);
      }
    );

    template.addArrayOutput('vms', vms.map(getResourceId));
  }
});