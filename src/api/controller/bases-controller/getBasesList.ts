import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/list
 */
export function getBasesList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/bases/list`, config);
}
