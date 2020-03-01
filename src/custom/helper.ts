import { custom, getResourceId, Expressionable } from 'arm-templator';
import { ResourceReference } from 'arm-templator/dist/common';

export function getPrimaryStorageKey(resourceRef: ResourceReference<any>): Expressionable<string> {
  return custom<any>(
    'listKeys', [
      getResourceId(resourceRef),
      '2016-01-01'
    ]
  ).call('keys[0]').call('value');
}

export function getBackupStorageKey(resourceRef: ResourceReference<any>): Expressionable<string> {
  return custom<any>(
    'listKeys', [
      getResourceId(resourceRef),
      '2016-01-01'
    ]
  ).call('keys[1]').call('value');
}