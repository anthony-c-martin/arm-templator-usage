import { Expressionable } from 'arm-templator/dist/common';
import { VirtualMachineProperties, StorageProfile } from 'arm-templator-types/dist/compute/2019-07-01';
import { NetworkInterfacePropertiesFormat } from 'arm-templator-types/dist/network/2019-11-01';

const baseStorageProfile: StorageProfile = {
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

export const createBaseVm = (computerName: Expressionable<string>, nicResourceId: Expressionable<string>): VirtualMachineProperties => ({
  osProfile: {
    computerName: computerName,
    adminUsername: 'antm88',
    adminPassword: 'secretPassword',
    windowsConfiguration: {
      provisionVMAgent: true,
    },
  },
  hardwareProfile: {
    vmSize: 'Standard_A1_v2',
  },
  storageProfile: baseStorageProfile,
  networkProfile: {
    networkInterfaces: [
      {
        properties: {
          primary: true
        },
        id: nicResourceId,
      },
    ]
  },
});

export const createBaseNic = (subnetResourceId: Expressionable<string>, publicIpAddressResourceId: Expressionable<string>): NetworkInterfacePropertiesFormat => ({
  ipConfigurations: [{
    name: 'myConfig',
    properties: {
      subnet: {
        id: subnetResourceId,
      },
      privateIPAllocationMethod: 'Dynamic',
      publicIPAddress: {
        id: publicIpAddressResourceId,
      }
    }
  }],
});