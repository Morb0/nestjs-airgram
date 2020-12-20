import { SetMetadata } from '@nestjs/common';
import { EVENT_LISTENER_TYPE } from '../airgram.constants';
import { EventListenerType } from '../enums/event-listener-type.enum';

export const OnUpdate = (): MethodDecorator =>
  SetMetadata(EVENT_LISTENER_TYPE, EventListenerType.OnUpdate);
