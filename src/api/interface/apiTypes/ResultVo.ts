export interface ResultVo<T = any> {
    /** 状态码 */
    code?: string;
    /** 返回消息 */
    message?: string;
    /** 返回的数据 */
    data?: T;
}
