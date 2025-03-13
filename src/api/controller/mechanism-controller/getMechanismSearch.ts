import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /mechanism/search
 */
export function getMechanismSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/mechanism/search`, config);
}
