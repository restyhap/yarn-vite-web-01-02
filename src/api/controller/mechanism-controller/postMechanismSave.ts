import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Mechanism } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/save
 */
export function postMechanismSave(input: Mechanism, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/mechanism/save`, input, config);
}
