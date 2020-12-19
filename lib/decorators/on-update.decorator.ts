import { SetMetadata } from '@nestjs/common';
import { UPDATE } from '@airgram/constants';
import { UPDATE_EVENT_LISTENER_METADATA } from '../airgram.constants';

export const OnUpdate = (updateEvent: UPDATE): MethodDecorator =>
  SetMetadata(UPDATE_EVENT_LISTENER_METADATA, updateEvent);
