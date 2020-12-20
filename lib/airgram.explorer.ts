import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { Airgram, NextFn } from 'airgram';
import { AirgramMetadataAccessor } from './airgram-metadata.accessor';
import { InjectAirgram } from './decorators/inject-airgram.decorator';
import { Context } from '@airgram/core/types/airgram';
import { OnType } from './decorators/on.decorator';

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
      .filter(wrapper => wrapper.isDependencyTreeStatic()) // What that check?
      .filter(wrapper => wrapper.instance)
      .forEach(wrapper => {
        const { instance } = wrapper;

        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) =>
            this.subscribeToEventsIfListener(instance, methodKey),
        );
      });
  }

  private subscribeToEventsIfListener(
    instance: Record<string, any>,
    methodKey: string,
  ): void {
    const onOptions = this.metadataAccessor.getEventsListenerMetadata(
      instance[methodKey],
    );
    if (!onOptions) return;

    this.airgram.use((ctx: Context, next: NextFn) => {
      if (ctx._ === onOptions.event) {
        instance[methodKey].call(instance, ctx);
      } else if (onOptions.type === OnType.OnlyUpdates) {
        if ('update' in ctx) {
          instance[methodKey].call(instance, ctx);
        }
      } else if (onOptions.type === OnType.OnlyRequests) {
        if ('request' in ctx) {
          instance[methodKey].call(instance, ctx);
        }
      } else {
        instance[methodKey].call(instance, ctx);
      }

      next();
    });
  }
}
