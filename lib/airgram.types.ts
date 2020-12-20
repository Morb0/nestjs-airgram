import { Middleware } from '@airgram/core/types/airgram';
import { MethodName, UPDATE } from '@airgram/constants';

export type OnEvent = UpdateEvent | RequestEvent;
export type UpdateEvent = keyof typeof UPDATE;
export type RequestEvent = MethodName;

export type ExtractMiddlewareContext<Type> = Type extends Middleware<infer X>
  ? X
  : never;
