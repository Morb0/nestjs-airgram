import { AirgramModuleOptions } from './airgram-module-options.interface';

export interface AirgramOptionsFactory {
  createAirgramOptions(): AirgramModuleOptions;
}
