import request from "@/api/request";
import { type ResultVo, type DeepRequired, type BackInnerComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/save
 */
export function postBackInnerComponentsSave(input: BackInnerComponents, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/backInnerComponents/save`, input, config);
}
