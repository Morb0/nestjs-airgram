import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  EVENT_LISTENER_EVENT_NAME,
  EVENT_LISTENER_TYPE,
} from './airgram.constants';
import { EventListenerType } from './enums/event-listener-type.enum';
import { EventName } from './airgram.types';

@Injectable()
export class AirgramMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getEventListenerType(target: Function): EventListenerType | undefined {
    return this.reflector.get(EVENT_LISTENER_TYPE, target);
  }

  getEventsListenerEventsName(target: Function): EventName[] | undefined {
    const eventName = this.reflector.get(EVENT_LISTENER_EVENT_NAME, target);
    if (eventName) return [].concat(eventName);
  }
}
