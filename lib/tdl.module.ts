import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { TDL_MODULE_OPTIONS, TDL_PROVIDER } from './tdl.constants';
import { TdlProvider } from './tdl.provider';
import { TdlModuleAsyncOptions, TdlOptionsFactory, TdlModuleOptions } from './interfaces';

@Module({})
export class TdlModule {
  static forRoot(options: TdlModuleOptions): DynamicModule {
    const tdlProvider: Provider = {
      provide: TDL_PROVIDER,
      useClass: TdlProvider,
      inject: [TDL_MODULE_OPTIONS],
    };

    return {
      module: TdlModule,
      providers: [
        { provide: TDL_MODULE_OPTIONS, useValue: options },
        tdlProvider,
      ],
      exports: [tdlProvider],
    };
  }

  static forRootAsync(options: TdlModuleAsyncOptions): DynamicModule {
    const tdlProvider: Provider = {
      provide: TDL_PROVIDER,
      useClass: TdlProvider,
      inject: [TDL_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: TdlModule,
      imports: options.imports,
      providers: [...asyncProviders, tdlProvider],
      exports: [tdlProvider],
    };
  }

  private static createAsyncProviders(
    options: TdlModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncProvider(options)];
    }

    const useClass = options.useClass as Type<TdlOptionsFactory>;

    return [
      this.createAsyncProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncProvider(options: TdlModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: TDL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TdlOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<TdlOptionsFactory>,
    ];
    return {
      provide: TDL_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TdlOptionsFactory) =>
        await optionsFactory.createTdlOptions(),
      inject,
    };
  }
}
