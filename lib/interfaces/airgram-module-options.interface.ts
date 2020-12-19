import { Auth } from 'airgram';
import { ExtendedConfig } from 'airgram/Airgram';
import { TdJsonClient } from 'airgram/components';

export type AuthConfig = ConstructorParameters<typeof Auth>[0];

export interface AirgramModuleOptions extends ExtendedConfig {
  tdJsonClient?: TdJsonClient;
  auth?: AuthConfig;
}
