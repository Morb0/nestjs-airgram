import {
  DynamicModule,
  Global,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { DiscoveryModule, ModuleRef } from '@nestjs/core';
import { Airgram, Auth } from 'airgram';
import {
  AirgramModuleAsyncOptions,
  AirgramModuleOptions,
  AirgramOptionsFactory,
} from './interfaces';
import { AirgramMetadataAccessor } from './airgram-metadata.accessor';
import { AirgramExplorer } from './airgram.explorer';
import { AIRGRAM_CLIENT, AIRGRAM_MODULE_OPTIONS } from './airgram.constants';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [AirgramMetadataAccessor, AirgramExplorer],
})
export class AirgramModule
  implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationBootstrap(): void {
    const airgram = this.moduleRef.get<Airgram>(AIRGRAM_CLIENT);
    const options = this.moduleRef.get<AirgramModuleOptions>(
      AIRGRAM_MODULE_OPTIONS,
    );

    if (options.auth) {
      airgram.use(new Auth(options.auth));
    }
  }

  async onApplicationShutdown(): Promise<void> {
    const airgram = this.moduleRef.get<Airgram>(AIRGRAM_CLIENT);
    await airgram.destroy();
  }

  static forRoot(options: AirgramModuleOptions = {}): DynamicModule {
    const airgramConfig: Provider = {
      provide: AIRGRAM_MODULE_OPTIONS,
      useValue: options,
    };
    const airgramProvider = this.createAirgramProvider();

    return {
      module: AirgramModule,
      providers: [airgramConfig, airgramProvider],
      exports: [airgramProvider],
    };
  }

  static forRootAsync(options: AirgramModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const airgramProvider = this.createAirgramProvider();
    return {
      module: AirgramModule,
      imports: options.imports,
      providers: [...asyncProviders, airgramProvider],
      exports: [airgramProvider],
    };
  }

  private static createAirgramProvider(): Provider {
    return {
      provide: AIRGRAM_CLIENT,
      useFactory: (options: AirgramModuleOptions) => new Airgram(options),
      inject: [AIRGRAM_MODULE_OPTIONS],
    };
  }

  private static createAsyncProviders(
    options: AirgramModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<AirgramOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: AirgramModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AIRGRAM_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TelegrafOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<AirgramOptionsFactory>,
    ];
    return {
      provide: AIRGRAM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AirgramOptionsFactory) =>
        await optionsFactory.createAirgramOptions(),
      inject,
    };
  }
}
