import { UpdateEvent } from '../airgram.types';
import { On, OnType } from './on.decorator';

export const OnUpdate = (updateEvent: UpdateEvent): MethodDecorator =>
  On({ event: updateEvent, type: OnType.OnlyUpdates });
