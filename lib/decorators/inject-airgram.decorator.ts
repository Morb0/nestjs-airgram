import { Inject } from '@nestjs/common';
import { AIRGRAM_CLIENT } from '../airgram.constants';

export const InjectAirgram = (): ParameterDecorator => Inject(AIRGRAM_CLIENT);
