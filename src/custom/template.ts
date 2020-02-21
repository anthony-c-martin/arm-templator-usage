import { resourceGroupLocation, buildTemplate, Params, Outputs } from "arm-templator";
import { storageAccounts } from 'arm-templator-types/dist/storage/2019-06-01';
import { getPrimaryStorageKey, getBackupStorageKey } from "./helper";

const params = {
  name: Params.String,
}

const outputs = {
  primaryKey: Outputs.String,
  backupKey: Outputs.String,
}

export default buildTemplate(params, outputs, (params, template) => {
  const location = resourceGroupLocation();

  const account = template.deploy(
    storageAccounts.create(
      params.name,
      {
      },
      location,
      {
        name: 'Premium_ZRS',
      },
      'StorageV2'
    ));

  return {
    primaryKey: getPrimaryStorageKey(account),
    backupKey: getBackupStorageKey(account),
  };
});