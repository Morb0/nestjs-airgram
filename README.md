<p align="center">
    <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/nestjs-airgram"><img src="https://img.shields.io/npm/v/nestjs-airgram.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/nestjs-airgram"><img src="https://img.shields.io/npm/l/nestjs-airgram.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/nestjs-airgram"><img src="https://img.shields.io/npm/dm/nestjs-airgram.svg" alt="NPM Downloads" /></a>
</p>

## Description

[Airgram](https://github.com/airgram/airgram) module for [Nest](https://github.com/nestjs/nest).

## Installation

**NPM**
```bash
$ npm i -s nestjs-airgram
```

**Yarn**
```bash
$ yarn add nestjs-airgram
```

## Quick Start
Once the installation process is complete, now we need **TDLib 1.7** binaries, how to get them you need to build them by this [guide](https://github.com/tdlib/td#building), or you can found [here](https://github.com/Bannerets/tdl#installation),
then place binaries somewhere in your project workspace. Then we can import the module `TdlModule` either synchronously or asynchronosly into the root `AppModule`.

It is important to specify the correct path to the TDLib binaries in the `command` field.
It is directly passed to dlopen / LoadLibrary. Check your OS documentation to see where it searches for the library.

&nbsp;

### Synchronous configuration
```typescript
import { Module } from '@nestjs/common';
import { AirgramModule } from 'nestjs-airgram';

@Module({
  imports: [
    AirgramModule.forRoot({
      apiId: 'YOUR_APP_ID',
      apiHash: 'YOUR_API_HASH',
      command: path.resolve('tdjson.dll'), // Path to tdlib
      auth: {
        // ...
      },
    }),
  ],
})
export class AppModule {}
```

Then we can inject `Airgram` into our services. And use decorators for events.

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Airgram,
  Context,
  GetMeMiddleware,
  UpdateNewMessageMiddleware,
} from 'airgram';
import {
  ExtractMiddlewareContext,
  InjectAirgram,
  OnEvent,
  OnRequest,
  OnUpdate,
} from 'nestjs-airgram';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectAirgram() private airgram: Airgram) {
    setTimeout(() => this.onModuleInit(), 4000);
  }

  async onModuleInit(): Promise<void> {
    const me = await this.airgram.api.getMe();
    console.log('[Me]', me);
  }

  @OnEvent()
  onAnyEvent(ctx: Context): void {
    // This code will be invoked before every request and after all updates.
  }

  @OnUpdate()
  async onUpdate(update: unknown): Promise<void> {
    // This code will be invoked after update.
  }

  @OnRequest()
  async onRequest(): Promise<void> {
    // This code will be invoked before request.
  }

  @OnEvent('getMe')
  onGetMe(ctx: ExtractMiddlewareContext<GetMeMiddleware>): void {
    console.log('"GetMe" request triggered', ctx);
    // This code will be invoked before "Get me" request.
  }

  @OnEvent('updateNewMessage')
  onNewMessage(
    ctx: ExtractMiddlewareContext<UpdateNewMessageMiddleware>,
  ): void {
    console.log('"NewMessage" update triggered', ctx);
    // This code will be invoked after "New message" update.
  }
}

```
