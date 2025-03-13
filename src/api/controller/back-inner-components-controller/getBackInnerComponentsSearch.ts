import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/search
 */
export function getBackInnerComponentsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/backInnerComponents/search`, config);
}
