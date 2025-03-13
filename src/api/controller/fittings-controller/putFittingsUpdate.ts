import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Fittings } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /fittings/update
 */
export function putFittingsUpdate(input: Fittings, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/fittings/update`, input, config);
}
