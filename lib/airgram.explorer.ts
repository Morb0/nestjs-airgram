import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { AirgramMetadataAccessor } from './airgram-metadata.accessor';
import { Airgram, NextFn } from 'airgram';

@Injectable()
export class AirgramExplorer implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: AirgramMetadataAccessor,
    private readonly airgram: Airgram,
  ) {}

  onApplicationBootstrap(): void {
    this.explore();
  }

  explore(): void {
    const providers = this.discoveryService
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
            this.subscribeToEventIfListener(instance, methodKey),
        );
      });
    console.log(providers);
  }

  private subscribeToEventIfListener(
    instance: Record<string, any>,
    methodKey: string,
  ): void {
    const updateEvent = this.metadataAccessor.getUpdateHandlerMetadata(
      instance[methodKey],
    );
    if (!updateEvent) return;

    this.airgram.on(updateEvent, (ctx: unknown, next: NextFn) => {
      instance[methodKey].call(instance, [ctx]);
      next();
    });
  }
}
