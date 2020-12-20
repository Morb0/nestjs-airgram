import { Module } from '@nestjs/common';
import * as path from 'path';
import { AppService } from './app.service';
import { AirgramModule } from '../lib';

@Module({
  imports: [
    AirgramModule.forRoot({
      apiId: +process.env.API_ID!,
      apiHash: process.env.API_HASH,
      command: path.resolve('tdjson.dll'),
      logVerbosityLevel: 2,
      auth: {
        phoneNumber: process.env.ACCOUNT_PHONE,
        password: process.env.ACCOUNT_PASSWORD,
        code: process.env.ACCOUNT_AUTH_CODE,
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
