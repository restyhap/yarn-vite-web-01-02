import request from "@/api/request";
import { type ResultVo, type DeepRequired, type CartonDetails } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /cartonDetails/update
 */
export function putCartonDetailsUpdate(input: CartonDetails, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/cartonDetails/update`, input, config);
}
