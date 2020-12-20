import { SetMetadata } from '@nestjs/common';
import { OnEvent } from '../airgram.types';
import { EVENTS_LISTENER_METADATA } from '../airgram.constants';

export enum OnType {
  OnlyUpdates = 'onlyUpdates',
  OnlyRequests = 'onlyRequests',
}

export interface OnOptions {
  type?: OnType;
  event?: OnEvent | OnEvent[];
}

export const On = (options: OnOptions = {}): MethodDecorator =>
  SetMetadata(EVENTS_LISTENER_METADATA, options);
