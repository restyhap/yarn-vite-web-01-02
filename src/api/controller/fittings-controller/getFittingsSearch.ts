import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/search
 */
export function getFittingsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/fittings/search`, config);
}
