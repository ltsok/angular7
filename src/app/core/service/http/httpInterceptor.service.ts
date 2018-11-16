import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        
        //任意请求加上token
        const authReq = req.clone({
            url: (req.url + '$token=ltsok')
        });

        return next.handle(authReq).pipe(mergeMap((event: any) => {
            console.log(event);
            if ( event instanceof HttpResponse && event.status ===200 ) {
                return this.handleData(event);
            }
        }),
        catchError((err: HttpErrorResponse) => this.handleData(err)));
    }

    private handleData(
        event: HttpResponse<any> | HttpErrorResponse
    ): Observable<any> {
        
        switch (event.status) {
            case 200:
                if ( event instanceof HttpResponse ) {
                    const body: any = event.body;
                    console.log(body);
                    return of(event);
                }
            //未登录状态码
            case 401:
                console.log('not auth');
            case 404:
                console.log('404');
            default:
                return of(event);
        }
    }
}