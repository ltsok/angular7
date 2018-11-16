// 消息常量定义
export const MSG = {
    succ: '10000'
};


/**
 * 请求消息
 * @export
 * @class RequestMsg
 */
export class RequestMsg {
    
    id: string;

    /** 请求头参数 */
    header: Map<string, string> = new Map<string, string>();

    /** 请求过滤参数 */
    filter: Map<string, string> = new Map<string, string>();

    /** 请求资源 */
    resUrl: string;

    /** 请求资源标识 */
    res: string;

    /** 请求资源参数 */
    resParams: Map<string, string> = new Map<string, string>();

    /** 请求版本 */
    version: string;

    /** 请求内容 */
    content: any;

    /** 是否默认响应处理 */
    isDefRespProcess: boolean = false;

    /** 是否默认错误处理 */
    isDefErrProcess: boolean = false;

}


/**
 * 响应消息
 * @export
 * @class ResponseMsg
 */
export class ResponseMsg {

    /** 结果码消息 */
    result: ResultCode = new ResultCode();

    /** 响应业务消息 */
    content: any;
}


/**
 * 结果码
 * @export
 * @class ResultCode
 */
export class ResultCode {

    /** 结果码 */
    code: string;

    /** 结果码类型 */
    type: ResultCodeType;

    /** 结果码描述 */
    des: string;
}


/**
 * 结果码类型
 * @export
 * @enum {number}
 */
export enum ResultCodeType {
    client,
    server
}

