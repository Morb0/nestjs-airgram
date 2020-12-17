import { TdlModuleOptions } from './tdl-module-options.interface';

export interface TdlOptionsFactory {
  createTdlOptions(): TdlModuleOptions;
}
