import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Bases } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/update
 */
export function putBasesUpdate(input: Bases, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/bases/update`, input, config);
}
