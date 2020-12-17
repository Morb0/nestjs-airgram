import { ConfigType, ITDLibJSON, LoginDetails } from 'tdl';

export interface TdlModuleOptions {
  apiId: number;
  apiHash: string;
  loginDetails: LoginDetails;
  tdlibPath: string;
  tdlibInstance?: ITDLibJSON;
  options?: Omit<ConfigType, 'apiId' | 'apiHash'>;
}
