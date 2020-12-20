import { applyDecorators, SetMetadata } from '@nestjs/common';
import { EventName } from '../airgram.types';
import {
  EVENT_LISTENER_EVENT_NAME,
  EVENT_LISTENER_TYPE,
} from '../airgram.constants';
import { EventListenerType } from '../enums/event-listener-type.enum';

export const OnEvent = (event?: EventName | EventName[]): MethodDecorator =>
  applyDecorators(
    SetMetadata(EVENT_LISTENER_TYPE, EventListenerType.OnEvent),
    SetMetadata(EVENT_LISTENER_EVENT_NAME, event),
  );
