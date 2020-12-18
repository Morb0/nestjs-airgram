import { ConfigType, ITDLibJSON, LoginDetails } from 'tdl';

export interface TdlModuleOptions extends ConfigType {
  loginDetails?: LoginDetails;
  tdlibPath?: string;
  tdlibInstance?: ITDLibJSON;
}
