import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /arms/list
 */
export function getArmsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/arms/list`, config);
}
