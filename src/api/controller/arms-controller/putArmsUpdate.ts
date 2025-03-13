import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Arms } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /arms/update
 */
export function putArmsUpdate(input: Arms, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/arms/update`, input, config);
}
