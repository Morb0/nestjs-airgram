import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UPDATE } from '@airgram/constants';
import { UPDATE_EVENT_LISTENER_METADATA } from './airgram.constants';

@Injectable()
export class AirgramMetadataAccessor {
  constructor(private readonly reflector: Reflector) {
  }

  getUpdateHandlerMetadata(target: Type<unknown>): UPDATE | undefined {
    return this.reflector.get(UPDATE_EVENT_LISTENER_METADATA, target);
  }
}
