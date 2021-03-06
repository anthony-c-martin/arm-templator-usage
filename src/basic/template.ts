import { buildTemplate, concat, getResourceId, resourceGroupLocation, Params, Outputs } from 'arm-templator';
import { virtualMachines, StorageProfile } from 'arm-templator-types/dist/compute/2019-07-01';
import { networkInterfaces } from 'arm-templator-types/dist/network/2019-11-01';

const defaultStorageProfile: StorageProfile = {
  imageReference: {
    publisher: 'MicrosoftWindowsServer',
    offer: 'WindowsServer',
    sku: '2016-Datacenter',
    version: 'latest'
  },
  osDisk: {
    createOption: 'FromImage'
  },
  dataDisks: []
};

const params = {
  namePrefix: Params.String,
  subnetResourceId: Params.String,
}

const outputs = {
  storageUri: Outputs.String,
}

export default buildTemplate(params, outputs, (params, template) => {
  const location = resourceGroupLocation();
  const { namePrefix, subnetResourceId } = params;

  // example of un-typed resource
  const storageAccount = template.deploy({
    apiVersion: '2015-06-15',
    type: 'Microsoft.Storage/storageAccounts',
    name: [concat(namePrefix, 'stg')],
    location: location,
    properties: {
      accountType: 'Standard_LRS',
    }
  }, []);

  const nic = template.deploy(
    networkInterfaces.create(
      concat(namePrefix, '-nic'), {
        ipConfigurations: [{
          name: 'myConfig',
          properties: {
            subnet: {
              id: subnetResourceId,
            },
            privateIPAllocationMethod: 'Dynamic',
          }
        }],
      }, location),
    []);

  const storageUri = concat('http://', storageAccount.name[0], '.blob.core.windows.net');

  const vm = template.deploy(
    virtualMachines.create(
      concat(namePrefix, '-vm'), {
        osProfile: {
          computerName: 'myVm',
          adminUsername: concat(namePrefix, 'admin'),
          adminPassword: 'myS3cretP@ssw0rd',
          windowsConfiguration: {
            provisionVMAgent: true,
          },
        },
        hardwareProfile: {
          vmSize: 'Standard_A1_v2',
        },
        storageProfile: defaultStorageProfile,
        networkProfile: {
          networkInterfaces: [
            {
              properties: {
                primary: true
              },
              id: getResourceId(nic),
            },
          ]
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            enabled: true,
            storageUri: storageUri,
          },
        },
      }, location),
    [nic, storageAccount]);

  return {
    storageUri,
  };
});