import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Defects } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/save
 */
export function postDefectsSave(input: Defects, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/defects/save`, input, config);
}
