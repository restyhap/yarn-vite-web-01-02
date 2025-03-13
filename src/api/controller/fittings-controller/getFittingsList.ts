import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/list
 */
export function getFittingsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/fittings/list`, config);
}
