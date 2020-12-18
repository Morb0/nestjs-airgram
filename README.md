<p align="center">
    <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/nestjs-tdl"><img src="https://img.shields.io/npm/v/nestjs-tdl.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/nestjs-tdl"><img src="https://img.shields.io/npm/l/nestjs-tdl.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/nestjs-tdl"><img src="https://img.shields.io/npm/dm/nestjs-tdl.svg" alt="NPM Downloads" /></a>
</p>

## Description

[TDL](https://github.com/Bannerets/tdl) module for [Nest](https://github.com/nestjs/nest).

## Installation

**NPM**
```bash
$ npm i -s nestjs-tdl
```

**Yarn**
```bash
$ yarn add nestjs-tdl
```

## Quick Start
Once the installation process is complete, now we need TDLib binaries, how to get them you can found [here](https://github.com/Bannerets/tdl#installation),
then place binaries somewhere in your project workspace. Then we can import the module `TdlModule` either synchronously or asynchronosly into the root `AppModule`.

It is important to specify the correct path to the TDLib binaries in the `tdlibPath` field.

&nbsp;

### Synchronous configuration
```typescript
import { Module } from '@nestjs/common';
import { TdlModule } from 'nestjs-tdl';

@Module({
  imports: [
    TdlModule.forRoot({
      apiId: 'YOUR_APP_ID',
      apiHash: 'YOUR_API_HASH',
      tdlibPath: path.resolve(__dirname, /* Some path */ 'tdjson.dll'),
      loginDetails: {
        // ...
      },
    }),
  ],
})
export class AppModule {}
```

### Asynchronous configuration

In this example, the module integrates with the [@nestjs/config](https://github.com/nestjs/config) package.

`useFactory` should return an object with `TdlModuleOptions` interface.

```typescript
import { Module } from '@nestjs/common';
import { TdlModule } from 'nestjs-tdl';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TdlModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
          apiId: configService.get<number>('APP_ID'),
          apiHash: configService.get<string>('API_HASH'),
          tdlibPath: path.resolve(__dirname, /* Some path */ 'tdjson.dll'),
          loginDetails: {
            // ...
          },
        }),
    }),
  ],
})
export class AppModule {}
```

In most cases it will be more convenient to isolate the options in a separate factory class.
Here `TdlOptionsService` implements `TdlOptionsFactory` interface.

```typescript
import { Module } from '@nestjs/common';
import { TdlModule } from 'nestjs-tdl';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TdlModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TdlOptionsService,
    }),
  ],
})
export class AppModule {}
```

Then we can inject `TdlProvider` into our services.

```typescript
import { Injectable,OnModuleInit } from '@nestjs/common';
import { InjectTdl, TdlProvider } from 'nestjs-tdl';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectTdl() private tdl: TdlProvider) {}

  async onModuleInit(): Promise<void> {
    const me = await this.tdl.invoke({
       _: 'getMe',
     });

    console.log('Me:', me);
  }
}
```
