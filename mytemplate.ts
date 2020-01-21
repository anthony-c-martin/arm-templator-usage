import { renderTemplate, concat } from 'arm-templator';

export default renderTemplate(template => {
  const location = template.addStringParameter('location', 'West US');
  const resourceName = template.addStringParameter('resourceName', 'test');
  const subnetResourceId = template.addStringParameter('subnetResourceId');
  const publicIpAddressResourceId = template.addStringParameter('publicIpAddressResourceId');

  const storageAccount = template.deploy({
    apiVersion: '2015-06-15',
    type: 'Microsoft.Storage/storageAccounts',
    name: resourceName,
    location: location,
    properties: {
      accountType: 'Standard_LRS',
    }
  }, []);

  const nic = template.deploy({
    apiVersion: '2019-11-01',
    type: 'Microsoft.Network/networkInterfaces',
    name: resourceName,
    location,
    properties: {
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
    }
  },
  []);

  const storageUri = template.addVariable('bootDiagsUri', concat('http://', resourceName, '.blob.core.windows.net'));

  const vm = template.deploy({
    apiVersion: '2019-07-01',
    type: 'Microsoft.Compute/virtualMachines',
    name: resourceName,
    location,
    properties: {
      osProfile: {
        computerName: 'myVm',
        adminUsername: 'antm88',
        adminPassword: 'secretPassword',
        windowsConfiguration: {
          provisionVMAgent: true,
        },
      },
      hardwareProfile: {
        vmSize: 'Standard_A1_v2',
      },
      storageProfile: {
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
      },
      networkProfile: {
        networkInterfaces: [
          {
            properties: {
              primary: true
            },
            id: template.getResourceId(nic),
          },
        ]
      },
      diagnosticsProfile: {
        bootDiagnostics: {
          enabled: true,
          storageUri: storageUri,
        },
      },
    },
  },
  [nic, storageAccount]);

  template.addStringOutput('storageUri', storageUri);
});