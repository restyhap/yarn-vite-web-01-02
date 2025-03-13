import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Mechanism } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/update
 */
export function putMechanismUpdate(input: Mechanism, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/mechanism/update`, input, config);
}
