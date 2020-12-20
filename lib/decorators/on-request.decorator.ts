import { RequestEvent } from '../airgram.types';
import { On, OnType } from './on.decorator';

export const OnRequest = (requestEvent?: RequestEvent): MethodDecorator =>
  On({ event: requestEvent, type: OnType.OnlyRequests });
