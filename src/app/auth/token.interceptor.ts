import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { environment } from '../../environments/environment';
// import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {
    console.log(environment.authToken);
  }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    
    request = request.clone({
      setHeaders: {
        Authorization: 'Basic '+environment.authToken
      }
    });
    return next.handle(request);
  }
}