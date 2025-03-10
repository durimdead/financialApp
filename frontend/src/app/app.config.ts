import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { AppRoutes } from './app.routes';
import { AppRouterConfig } from './app.router-config';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

// interceptors are now recommended to be created as functions.
// in older versions of Angular, they were created as classes.
function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn){
    // const req = request.clone({
    //     headers: request.headers.set('X-DEBUG', 'TESTING')
    // });

    // console.log('[Outgoing Request]')
    // console.log('request: ');
    // console.log(request);
    // console.log('----------------------------------------------------------------------------');
    
    // look through the request type and output some information if this happens to be a "response" event
    return next(request).pipe(
        tap({
            next: event => {
                if (event.type === HttpEventType.Response){
                    // console.log('[Incoming Response]')
                    // console.log('event status: ');
                    // console.log(event.status);
                    // console.log('event body: ');
                    // console.log(event.body);
                    // console.log('----------------------------------------------------------------------------');
                }
            }
        })
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      AppRoutes,
      withComponentInputBinding(),
      withRouterConfig(AppRouterConfig)
    ),
    provideHttpClient(withInterceptors([loggingInterceptor])),
  ],
};
