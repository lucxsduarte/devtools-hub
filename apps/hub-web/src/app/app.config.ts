import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideSocketIo, SocketIoConfig} from 'ngx-socket-io';
import {routes} from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';

const socketConfig: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket'],
    autoConnect: true,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideSocketIo(socketConfig),
    provideHttpClient(withFetch())
  ]
};
