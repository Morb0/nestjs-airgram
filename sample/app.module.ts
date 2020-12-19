import { Module } from '@nestjs/common';
import { AirgramModule } from 'nestjs-airgram';
import * as path from 'path';
import { AppService } from './app.service';

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
        code: () => {
          const authCode = process.env.ACCOUNT_AUTH_CODE;

          if (!authCode) {
            throw new Error('Provide auth code and restart app.');
          }

          return authCode;
        },
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
