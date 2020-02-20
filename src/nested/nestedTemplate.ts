import { resourceGroupLocation, concat, getResourceId, buildTemplate, Params, Outputs } from 'arm-templator';
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

  const publicIp = template.deploy({
    type: 'Microsoft.Network/publicIPAddresses',
    apiVersion: '2019-11-01',
    name: [concat(namePrefix, '-pip', index)],
    location: location,
    properties: {
      publicIPAllocationMethod: 'Dynamic',
    }
  });

  const nic = template.deploy({
    type: 'Microsoft.Network/networkInterfaces',
    apiVersion: '2019-11-01',
    name: [concat(namePrefix, '-nic', index)],
    location: location,
    properties: createBaseNic(subnetResourceId, getResourceId(publicIp)),
  }, [publicIp]);

  const vm = template.deploy({
    type: 'Microsoft.Compute/virtualMachines',
    apiVersion: '2019-07-01',
    name: [concat(namePrefix,'-vm', index)],
    location: location,
    properties: createBaseVm(concat('vm', index), getResourceId(nic)),
  }, [nic]);

  return {
    vmResourceId: getResourceId(vm),
  };
});