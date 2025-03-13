import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/list
 */
export function getBackInnerComponentsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/backInnerComponents/list`, config);
}
