import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /bases/search
 */
export function getBasesSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/bases/search`, config);
}
