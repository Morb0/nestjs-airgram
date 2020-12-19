import { DynamicModule, Module, OnApplicationShutdown, Provider } from '@nestjs/common';
import { DiscoveryModule, ModuleRef } from '@nestjs/core';
import { Airgram, Auth } from 'airgram';
import { AirgramModuleOptions } from './interfaces';
import { AirgramMetadataAccessor } from './airgram-metadata.accessor';
import { AirgramExplorer } from './airgram.explorer';

@Module({
  imports: [DiscoveryModule],
  providers: [AirgramMetadataAccessor, AirgramExplorer],
})
export class AirgramModule implements OnApplicationShutdown {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {
  }

  static forRoot(options: AirgramModuleOptions = {}): DynamicModule {
    const airgramProvider = this.createAirgramProvider(options);

    return {
      module: AirgramModule,
      providers: [airgramProvider],
      exports: [airgramProvider],
    }
  }

  async onApplicationShutdown(): Promise<void> {
    const airgram = this.moduleRef.get<Airgram>(Airgram);
    await airgram.destroy();
  }

  // static forRootAsync(options: AirgramModuleAsyncOptions): DynamicModule {
  //
  // }

  private static createAirgramProvider(options: AirgramModuleOptions): Provider {
    const airgram = new Airgram(options);

    if (options.auth) {
      airgram.use(new Auth(options.auth));
    }

    return {
      provide: Airgram,
      useValue: airgram,
    }
  }
}
