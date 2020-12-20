import { Injectable, OnModuleInit } from '@nestjs/common';
import { Airgram, ChangePhoneNumberMiddleware, Context } from 'airgram';
import { UpdateNewMessageMiddleware } from '@airgram/core/types/api-middleware';
import {
  ExtractMiddlewareContext,
  InjectAirgram,
  On,
  OnRequest,
  OnUpdate,
} from '../lib';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectAirgram() private airgram: Airgram) {}

  async onModuleInit(): Promise<void> {
    const me = await this.airgram.api.getMe();
    console.log('[Me]', me);
  }

  @On()
  onAnyEvent(ctx: Context): void {
    // This code will be invoked before every request and after all updates.
  }

  @OnUpdate('updateNewMessage')
  async handleNewMessage(
    ctx: ExtractMiddlewareContext<UpdateNewMessageMiddleware>,
  ): Promise<void> {
    // This code will be invoked after "New message" update.
  }

  @OnRequest('getMe')
  async onMeRequest(
    ctx: ExtractMiddlewareContext<ChangePhoneNumberMiddleware>,
  ): Promise<void> {
    // This code will be invoked before "Get me" request.
  }
}
