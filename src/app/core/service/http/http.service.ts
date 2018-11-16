import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RequestMsg, ResponseMsg, MSG, ResultCodeType } from './http.service.model';
import { LoggerService } from '../logger/logger.service';
import { CacheService } from '../cache/cache.service';
import { StorageService } from '../storage/storage.service';
import { TpiGlobalService } from '../tpi/tpi-global.service'
import { constant } from './http.constant';

/**
 * http(s)服务
 * @export
 * @class HttpService
 */
@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private cache: CacheService,
    private local: StorageService,
    private global: TpiGlobalService
  ) {
    this.logger.info(constant.identifier, 'Initialize http service.');
  }

  /**
   * 发送get消息
   * @param {RequestMsg} request
   * @returns {(Observable<ResponseMsg | any>)}
   * @memberof HttpService
   */
  public get(request: RequestMsg): Observable<ResponseMsg | any> {
    this.logger.debug(constant.identifier, request, 'get');
    return this.http.get(this.getUrl(request), { headers: this.getHeaders(request) })
      .pipe(
        map((result: ResponseMsg)=>{
          return this.handleSucc(result, request);
        }),
        timeout(3000),
        retry(2),
        catchError(this.handleError(this.getUrl(request), {}))
      );
  }

  /**
   * Post请求
   * @param url 
   * @param body 
   */
  public post(request: RequestMsg): Observable<any> {
    return this.http.post(this.getUrl(request), JSON.stringify(request.content), { headers: this.getHeaders(request) })
      .pipe(
        map((result: ResponseMsg) => {
          return this.handleSucc(result, request);
        }),
        timeout(3000),
        catchError(this.handleError(this.getUrl(request), {}))
      );
  }

  /**
   * Delete请求
   * @param url 
   * @param body 
   */
  public delete(request: RequestMsg): Observable<any> {
    return this.http.delete(this.getUrl(request), { headers: this.getHeaders(request) })
      .pipe(
        map((result: ResponseMsg) => {
          return this.handleSucc(result, request);
        }),
        timeout(3000),
        catchError(this.handleError(this.getUrl(request), {}))
      );
  }

  /**
   * Put请求
   * @param url 
   * @param body 
   */
  public put(request: RequestMsg): Observable<any> {
    return this.http.put(this.getUrl(request), JSON.stringify(request.content), { headers: this.getHeaders(request) })
      .pipe(
        map((result: ResponseMsg) => {
          return result;
        }),
        timeout(3000),
        catchError(this.handleError(this.getUrl(request), {}))
      );
  }

  /**
   * 获取头参数
   * @private
   * @param {RequestMsg} request
   * @returns {Headers}
   * @memberof HttpService
   */
  private getHeaders(request: RequestMsg): HttpHeaders {

    // 设置默认值
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Token', this.cache.getCache("token"));

    // 转换请求中的头信息
    request.header.forEach((value: string, key: string) => {
      headers.append(key, value);
    });

    return headers;
  }

  /**
   * 获取全URL
   * @private
   * @param {RequestMsg} request
   * @returns {string}
   * @memberof HttpService
   */
  private getUrl(request: RequestMsg): string {

    // 1.如果请求中设置了resUrl，则以resUrl拼接完整的url,否则使用res和resParams拼接完整的url
    // 2.如果请求中设置了version，则以version拼接完整的url，否则使用全局默认的版本拼接完整的url
    // 3.如果请求中设置了filter，则将其拼接到完整的url中，否则不处理
    let resUrl = request.resUrl ? request.resUrl : this.getResUrl(request.res, request.resParams);
    let version = request.version ? request.version : this.getServerVersion();
    let filter = request.filter.size > 0 ? this.getFilter(request.filter) : '';

    // 如果请求和系统中都没有配置版本则在
    let url = '';
    if (version) {
      url = encodeURI(this.getServerUrl() + '/' + version + resUrl + filter);
    } else {
      url = encodeURI(this.getServerUrl() + resUrl + filter);
    }
    return url;
  }

  /**
   * 获取资源URL
   * @private
   * @param {string} res
   * @param {Map<string, string>} resParams
   * @returns {string}
   * @memberof HttpService
   */
  private getResUrl(res: string, resParams: Map<string, string>): string {

    // 获取资源url
    let resUrl = res;

    // 替换变量
    resParams.forEach((value: string, key: string) => {
      resUrl.replace('{{' + key + '}}', value);
    });

    return resUrl;
  }

  /**
   * 获取服务版本
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  public getServerVersion(): string {

    // 获取配置的服务版本
    let version = this.getCurServerInfo()['server.version'];

    // 如果没有配置服务版本，则返回默认值
    if (version) {
      return version;
    } else {
      return 'v1';
    }
  }

  /**
   * 获取过滤参数
   * @private
   * @param {Map<string, string>} filter
   * @returns {string}
   * @memberof HttpService
   */
  private getFilter(filter: Map<string, string>): string {

    let strFilter = [];
    filter.forEach((value: string, key: string) => {
      strFilter.push(key + '=' + value);
    });
    return '?' + strFilter.join('&');
  }

  /**
  * 获取服务端url
  * @private
  * @returns {string}
  * @memberof HttpService
  */
  public getServerUrl(): string {
    return this.getServerProtocol() + '://' + this.getServerHost() + this.getServerPath();
  }

  /**
   * 获取服务端的host
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  private getServerProtocol(): string {

    // 获取配置的服务协议类型
    let protocol = this.getCurServerInfo()['server.protocol'];

    // 如果没有配置服务协议类型，则返回默认值
    if (protocol) {
      return protocol;
    } else {
      return 'http';
    }
  }

  /**
   * 获取服务端的host
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  private getServerHost(): string {

    // 获取配置的ip和端口
    let ip = this.getCurServerInfo()['server.ip'];
    let port = this.getCurServerInfo()['server.port'];

    // 如果没有配置ip和端口 或者 配置为空，则返回默认和前端的host一样，否则使用配置中host
    if (ip && port) {
      return ip + ':' + port;
    } else {
      return document.location.host;
    }
  }

  /**
   * 获取服务路径
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  private getServerPath(): string {

    // 获取配置的服务路径
    let path = this.getCurServerInfo()['server.path'];

    // 如果没有配置服务路径，则返回默认值
    if (path) {
      return path;
    } else {
      return '';
    }
  }

  /**
   * 获取当前选择连接的服务器信息
   * @private
   * @returns {*}
   * @memberof HttpService
   */
  private getCurServerInfo(): any {
    return this.local.getJsonObj(this.cache.getCache('server.selected'), true);
  }

  /**
   * JsonP跨域,后台需要修改相关配置
   * @param url 
   * @param callback 
   */
  public jsonP(url: string, callback?: string) {
    return this.http.jsonp(url, callback ? callback : "callback");
  }

  private handleSucc(response: ResponseMsg, request: RequestMsg): ResponseMsg | any {
    this.logger.debug(constant.identifier, response, request.id);
    if ( request.isDefRespProcess ) {

      // 如果响应结构符合（isDefRespProcess控制）默认结构则进行默认处理，否则直接返回响应内容由调用端处理
      if ( response.result.code === MSG.succ ) {

        // 应用成功
        return response;
      } else {

        // 打印错误日志
        this.logger.error(constant.identifier, response);

        // 错误信息
        if ( request.isDefErrProcess ) {

          // 设置结果码类型
          let resultType = response.result.type;
          if ( !resultType ) resultType = ResultCodeType.server;
          
          // 弹出错误
          // TODO:弹出框
          this.global.getGlobalService().errorDialog();
        }
      }
    } else {
      return response;
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
