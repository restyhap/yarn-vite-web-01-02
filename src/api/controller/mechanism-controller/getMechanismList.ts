import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/list
 */
export function getMechanismList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/mechanism/list`, config);
}
