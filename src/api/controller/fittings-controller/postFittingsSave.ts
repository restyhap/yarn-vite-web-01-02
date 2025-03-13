import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Fittings } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/save
 */
export function postFittingsSave(input: Fittings, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/fittings/save`, input, config);
}
