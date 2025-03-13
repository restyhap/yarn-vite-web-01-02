import request from "@/api/request";
import { type ResultVo, type DeepRequired, type CartonDetails } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/save
 */
export function postCartonDetailsSave(input: CartonDetails, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/cartonDetails/save`, input, config);
}
