import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Arms } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /arms/save
 */
export function postArmsSave(input: Arms, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/arms/save`, input, config);
}
