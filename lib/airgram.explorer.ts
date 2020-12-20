import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { Airgram, MiddlewareFn } from 'airgram';
import { Composer, Context } from '@airgram/core';
import { AirgramMetadataAccessor } from './airgram-metadata.accessor';
import { InjectAirgram } from './decorators';
import { EventListenerType } from './enums/event-listener-type.enum';

@Injectable()
export class AirgramExplorer implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: AirgramMetadataAccessor,
    @InjectAirgram() private readonly airgram: Airgram,
  ) {}

  onModuleInit(): void {
    this.explore();
  }

  explore(): void {
    this.discoveryService
      .getProviders()
      .filter(wrapper => wrapper.instance)
      .forEach(wrapper => {
        const { instance } = wrapper;

        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) => this.lookupListener(instance, methodKey),
        );
      });
  }

  private lookupListener(
    instance: Record<string, Function>,
    methodKey: string,
  ): void {
    const methodRef = instance[methodKey];
    const listenerType = this.metadataAccessor.getEventListenerType(methodRef);
    if (!listenerType) return;

    const middlewareWrap: MiddlewareFn = (ctx, next) => {
      methodRef.call(instance, ctx);
      return next();
    };

    switch (listenerType) {
      case EventListenerType.OnEvent: {
        const eventName = this.metadataAccessor.getEventsListenerEventsName(
          methodRef,
        );

        if (eventName) {
          return this.airgram.on(eventName, middlewareWrap);
        } else {
          return this.airgram.use(middlewareWrap);
        }
      }
      case EventListenerType.OnUpdate: {
        return this.airgram.use(
          Composer.optional((ctx: Context) => 'update' in ctx, middlewareWrap),
        );
      }
      case EventListenerType.OnRequest: {
        return this.airgram.use(
          Composer.optional((ctx: Context) => 'request' in ctx, middlewareWrap),
        );
      }
    }
  }
}
