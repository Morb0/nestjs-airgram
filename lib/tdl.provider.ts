import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import Client, { TdlError } from 'tdl';
import { TDLib } from 'tdl-tdlib-addon';
import { TDL_MODULE_OPTIONS } from './tdl.constants';
import { TdlModuleOptions } from './interfaces';

@Injectable()
export class TdlProvider
  extends Client
  implements OnModuleInit, OnApplicationShutdown {
  private logger = new Logger(TdlProvider.name);

  constructor(@Inject(TDL_MODULE_OPTIONS) private options: TdlModuleOptions) {
    super(
      options.tdlibInstance || new TDLib(options.tdlibPath),
      Object.assign(options.options || {}, {
        apiId: options.apiId,
        apiHash: options.apiHash,
      }),
    );
  }

  async onModuleInit(): Promise<void> {
    this.setupErrorHandler();
    this.setFatalErrorHandler();
    await this.makeConnection().then(() => this.makeLogin);
  }

  private setupErrorHandler(): void {
    this.on('error', (err) => {
      this.logger.error('Unexpected error', err.message);
    });
  }

  private setFatalErrorHandler(): void {
    this.setLogFatalErrorCallback((message) => {
      this.logger.error('Fatal error', message);
    });
  }

  private async makeConnection(): Promise<void> {
    await this.connect()
      .then(() => this.logger.log('Connected successfully'))
      .catch((err) => this.logger.error('Failed to connect', err.message));
  }

  private async makeLogin(): Promise<void> {
    await this.login(() => this.options.loginDetails)
      .then(() => this.logger.log('Authorized successfully'))
      .catch((err) => this.logger.error('Failed to login', err.message));
  }

  async onApplicationShutdown(): Promise<void> {
    await this.close();
  }
}
