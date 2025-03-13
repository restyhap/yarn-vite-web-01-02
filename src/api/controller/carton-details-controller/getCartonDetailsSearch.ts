import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/search
 */
export function getCartonDetailsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/cartonDetails/search`, config);
}
