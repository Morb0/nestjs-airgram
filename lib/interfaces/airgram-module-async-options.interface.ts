import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { AirgramOptionsFactory } from './airgram-options-factory.interface';
import { AirgramModuleOptions } from './airgram-module-options.interface';

export interface AirgramModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AirgramOptionsFactory>;
  useClass?: Type<AirgramOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<AirgramModuleOptions> | AirgramModuleOptions;
  inject?: FactoryProvider['inject'];
}
