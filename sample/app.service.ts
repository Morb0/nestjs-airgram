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
} from '../lib';

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
