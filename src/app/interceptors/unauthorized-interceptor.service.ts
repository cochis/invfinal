import { Injectable, inject } from '@angular/core'
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { FunctionsService } from '../shared/services/functions.service'
import { LogsService } from '../core/services/logs.service';


@Injectable()
export class UnauthorizedInterceptorService implements HttpInterceptor {
  constructor(
    private functionService: FunctionsService,
    private logsService: LogsService,

  ) { }

  intercept(
    request: any,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const funtionsService = inject(FunctionsService)
    return next.handle(request).pipe(
      tap((event: any) => {
        if (request.method != 'GET') {
          if (event.body && !request.url.includes('log')) {
            let log = {
              url: request.url,
              method: request.method,
              queryParams: request.urlWithParams,
              request: request.body,
              response: event.body,
              statusCode: event.status,
              usuarioCreated: this.functionService.getLocal('uid'),
              dateCreated: this.functionService.getToday(),
              lastEdited: this.functionService.getToday(),
            }
            this.logsService.crearLog(log).subscribe((resp) => {
            })
          }
        }
      }),
      catchError((err) => {
        if (err.error.msg === 'Token no válido') {
          funtionsService.alert('Token', 'Sesión cerrada', 'error')
          this.functionService.logout()
        }
        const error = err.error?.message || err.statusText
        return next.handle(request)
      },
      ),
    )
  }
}
