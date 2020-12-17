import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { TdlModuleOptions } from './tdl-module-options.interface';
import { TdlOptionsFactory } from './tdl-options-factory.interface';

export interface TdlModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TdlOptionsFactory>;

  useClass?: Type<TdlOptionsFactory>;

  useFactory?: (...args: any[]) => Promise<TdlModuleOptions> | TdlModuleOptions;

  inject?: FactoryProvider['inject'];
}
