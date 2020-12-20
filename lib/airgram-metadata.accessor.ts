import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EVENTS_LISTENER_METADATA } from './airgram.constants';
import { OnOptions } from './decorators/on.decorator';

@Injectable()
export class AirgramMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getEventsListenerMetadata(target: Type<unknown>): OnOptions | undefined {
    return this.reflector.get(EVENTS_LISTENER_METADATA, target);
  }
}
