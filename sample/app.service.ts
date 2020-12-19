import { Injectable, OnModuleInit } from '@nestjs/common';
import { UPDATE } from '@airgram/constants';
import { Airgram, UpdateContext, UpdateNewMessage } from 'airgram';
import { OnUpdate } from 'nestjs-airgram';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private airgram: Airgram) {}

  async onModuleInit(): Promise<void> {
    const me = await this.airgram.api.getMe();
    console.log('[Me]', me);
  }

  @OnUpdate(UPDATE.updateNewMessage)
  async handleNewMessage(ctx: UpdateContext<UpdateNewMessage>): Promise<void> {
    console.log('New message', ctx);
  }
}
