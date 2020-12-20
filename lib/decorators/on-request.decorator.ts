import { SetMetadata } from '@nestjs/common';
import { EVENT_LISTENER_TYPE } from '../airgram.constants';
import { EventListenerType } from '../enums/event-listener-type.enum';

export const OnRequest = (): MethodDecorator =>
  SetMetadata(EVENT_LISTENER_TYPE, EventListenerType.OnRequest);
