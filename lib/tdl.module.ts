import { DynamicModule, Module } from '@nestjs/common';
import { TdlCoreModule } from './tdl-core.module';
import { TdlModuleAsyncOptions, TdlModuleOptions } from './interfaces';

@Module({})
export class TdlModule {
  public static forRoot(options: TdlModuleOptions): DynamicModule {
    return {
      module: TdlModule,
      imports: [TdlCoreModule.forRoot(options)],
      exports: [TdlCoreModule],
    };
  }

  public static forRootAsync(options: TdlModuleAsyncOptions): DynamicModule {
    return {
      module: TdlModule,
      imports: [TdlCoreModule.forRootAsync(options)],
      exports: [TdlCoreModule],
    };
  }
}
