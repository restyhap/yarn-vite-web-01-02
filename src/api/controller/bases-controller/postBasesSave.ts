import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Bases } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/save
 */
export function postBasesSave(input: Bases, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/bases/save`, input, config);
}
