import { resourceGroupLocation, concat, getResourceId, buildTemplate, Params, Outputs } from 'arm-templator';
import { virtualMachines } from 'arm-templator-types/dist/compute/2019-07-01';
import { networkInterfaces, publicIPAddresses } from 'arm-templator-types/dist/network/2019-11-01';
import { createBaseNic, createBaseVm } from '../modular/utils';

const params = {
  index: Params.String,
  namePrefix: Params.String,
  subnetResourceId: Params.String,
}

const outputs = {
  vmResourceId: Outputs.String,
}

export default buildTemplate(params, outputs, (params, template) => {
  const location = resourceGroupLocation();
  const { index, namePrefix, subnetResourceId } = params;

  const publicIp = template.deploy(
    publicIPAddresses.create(
      concat(namePrefix, '-pip', index),
      {
        publicIPAllocationMethod: 'Dynamic',
      },
      location),
    []);

  const nic = template.deploy(
    networkInterfaces.create(
      concat(namePrefix, '-nic', index),
      createBaseNic(subnetResourceId, getResourceId(publicIp)),
      location),
    [publicIp]);

  const vm = template.deploy(
    virtualMachines.create(
      concat(namePrefix, '-vm', index),
      createBaseVm(concat('vm', index), getResourceId(nic)),
      location),
    [nic]);

  return {
    vmResourceId: getResourceId(vm),
  };
});