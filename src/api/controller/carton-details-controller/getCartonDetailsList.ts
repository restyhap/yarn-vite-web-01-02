import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/list
 */
export function getCartonDetailsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/cartonDetails/list`, config);
}
