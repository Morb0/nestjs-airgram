import { Inject } from '@nestjs/common';
import { TDL_PROVIDER } from '../tdl.constants';

export const InjectTdl = (): ParameterDecorator => Inject(TDL_PROVIDER);
