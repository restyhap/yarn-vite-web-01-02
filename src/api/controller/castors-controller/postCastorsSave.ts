import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Castors } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/save
 */
export function postCastorsSave(input: Castors, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/castors/save`, input, config);
}
